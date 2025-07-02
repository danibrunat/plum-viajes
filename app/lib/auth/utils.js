import { AuthMiddleware } from "./middleware.js";

/**
 * Authentication utilities for API routes
 */
export const AuthUtils = {
  /**
   * Higher-order function to protect API routes
   * @param {Function} handler - The API route handler
   * @param {Object} options - Protection options
   * @returns {Function} Protected handler
   */
  protect: (handler, options = {}) => {
    const defaultOptions = {
      requireAuth: true,
      allowInternal: true,
      skipRoutes: [],
      ...options,
    };

    return AuthMiddleware.withAuth(handler, defaultOptions);
  },

  /**
   * Create a public API route (no authentication required)
   * @param {Function} handler - The API route handler
   * @returns {Function} Public handler
   */
  public: (handler) => {
    return AuthUtils.protect(handler, { requireAuth: false });
  },

  /**
   * Create an internal-only API route
   * @param {Function} handler - The API route handler
   * @returns {Function} Internal-only handler
   */
  internal: (handler) => {
    return AuthUtils.protect(handler, {
      requireAuth: true,
      allowInternal: true,
      externalAllowed: false,
    });
  },

  /**
   * Create an external-only API route (for external providers)
   * @param {Function} handler - The API route handler
   * @returns {Function} External-only handler
   */
  external: (handler) => {
    return AuthUtils.protect(handler, {
      requireAuth: true,
      allowInternal: false,
    });
  },

  /**
   * Validate request manually (for custom implementations)
   * @param {Request} request - The request to validate
   * @param {Object} options - Validation options
   * @returns {Promise<Object>} Validation result
   */
  validate: async (request, options = {}) => {
    return AuthMiddleware.authenticate(request, options);
  },

  /**
   * Extract authentication info from request context
   * @param {Object} context - Request context with auth info
   * @returns {Object} Authentication information
   */
  getAuthInfo: (context) => {
    return context?.auth || { type: "unknown" };
  },

  /**
   * Check if request is from internal source
   * @param {Object} context - Request context with auth info
   * @returns {boolean} True if internal
   */
  isInternal: (context) => {
    const authInfo = AuthUtils.getAuthInfo(context);
    return authInfo.type === "internal";
  },

  /**
   * Check if request is from external provider
   * @param {Object} context - Request context with auth info
   * @returns {boolean} True if external
   */
  isExternal: (context) => {
    const authInfo = AuthUtils.getAuthInfo(context);
    return authInfo.type === "external";
  },

  /**
   * Get provider information from context
   * @param {Object} context - Request context with auth info
   * @returns {string|null} Provider name
   */
  getProvider: (context) => {
    const authInfo = AuthUtils.getAuthInfo(context);
    return authInfo.provider || null;
  },
};

/**
 * Decorators for different authentication levels
 */
export const AuthDecorators = {
  /**
   * Require authentication (default behavior)
   */
  RequireAuth: (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = AuthUtils.protect(originalMethod);
    return descriptor;
  },

  /**
   * Allow public access
   */
  Public: (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = AuthUtils.public(originalMethod);
    return descriptor;
  },

  /**
   * Internal access only
   */
  Internal: (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = AuthUtils.internal(originalMethod);
    return descriptor;
  },

  /**
   * External providers only
   */
  External: (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = AuthUtils.external(originalMethod);
    return descriptor;
  },
};
