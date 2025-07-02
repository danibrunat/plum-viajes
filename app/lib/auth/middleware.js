import { apiKeyManager } from "./apiKeys.js";
import { getRouteConfig } from "./config.js";

/**
 * Authentication middleware for API routes
 * Handles both internal and external API key validation
 */
export class AuthMiddleware {
  /**
   * Authenticate API request
   * @param {Request} request - The incoming request
   * @param {Object} options - Authentication options
   * @returns {Object} Authentication result
   */
  static async authenticate(request, options = {}) {
    const {
      requireAuth = true,
      allowInternal = true,
      skipRoutes = [],
    } = options;

    const pathname = new URL(request.url).pathname;

    // Get route-specific configuration
    const routeConfig = getRouteConfig(pathname);

    // Skip authentication for specified routes
    if (skipRoutes.some((route) => pathname.startsWith(route))) {
      return {
        success: true,
        type: "skipped",
        reason: "Route excluded from authentication",
      };
    }

    // If route is public, allow access without authentication
    if (routeConfig.isPublic) {
      return {
        success: true,
        type: "public",
        reason: "Public route",
      };
    }

    // Check if it's an internal origin and internal access is allowed
    // BUT only if the route doesn't always require API key
    if (
      allowInternal &&
      !routeConfig.alwaysRequireApiKey &&
      apiKeyManager.isInternalOrigin(request)
    ) {
      return {
        success: true,
        type: "internal",
        provider: "internal",
        reason: "Internal origin detected",
      };
    }

    // If authentication is not required, allow access
    if (!requireAuth) {
      return {
        success: true,
        type: "public",
        reason: "Authentication not required",
      };
    }

    // Extract and validate API key
    const apiKey = apiKeyManager.extractApiKey(request);
    const validation = apiKeyManager.validateApiKey(apiKey);

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
        code: validation.code,
        status: 401,
      };
    }

    return {
      success: true,
      type: validation.type,
      provider: validation.provider,
      keyData: validation.keyData,
    };
  }

  /**
   * Create authentication response
   * @param {Object} authResult - Result from authenticate method
   * @returns {Response|null} Response object if authentication failed
   */
  static createAuthResponse(authResult) {
    if (authResult.success) {
      return null; // Continue processing
    }

    return new Response(
      JSON.stringify({
        error: true,
        message: authResult.error || "Authentication failed",
        code: authResult.code || "AUTH_FAILED",
      }),
      {
        status: authResult.status || 401,
        headers: {
          "Content-Type": "application/json",
          "WWW-Authenticate": 'Bearer realm="API", charset="UTF-8"',
        },
      }
    );
  }

  /**
   * Middleware wrapper for API routes
   * @param {Function} handler - The API route handler
   * @param {Object} authOptions - Authentication options
   * @returns {Function} Wrapped handler
   */
  static withAuth(handler, authOptions = {}) {
    return async (request, context) => {
      const authResult = await AuthMiddleware.authenticate(
        request,
        authOptions
      );

      if (!authResult.success) {
        return AuthMiddleware.createAuthResponse(authResult);
      }

      // Add auth info to context for use in the handler
      const enhancedContext = {
        ...context,
        auth: authResult,
      };

      return handler(request, enhancedContext);
    };
  }

  /**
   * Rate limiting per API key
   * @param {Object} authResult - Authentication result
   * @param {Request} request - The request object
   * @returns {Object} Rate limit result
   */
  static async checkRateLimit(authResult, request) {
    // Different rate limits for different types
    const rateLimits = {
      internal: { requests: 1000, window: 60 * 1000 }, // 1000/min for internal
      external: { requests: 100, window: 60 * 1000 }, // 100/min for external
      public: { requests: 10, window: 60 * 1000 }, // 10/min for public
    };

    const limit = rateLimits[authResult.type] || rateLimits.external;
    const identifier =
      authResult.keyData?.key ||
      request.headers.get("x-forwarded-for") ||
      "unknown";

    // Here you would implement actual rate limiting logic
    // For now, we'll return success
    return {
      success: true,
      limit,
      identifier,
    };
  }
}
