/**
 * Authentication configuration
 * Centralized configuration for the authentication system
 */
export const AuthConfig = {
  // API Key settings
  apiKeys: {
    headerNames: ["authorization", "x-api-key"],
    bearerPrefix: "Bearer ",
    externalKeyPrefix: "EXTERNAL_API_KEY_",
  },

  // Rate limiting configuration
  rateLimits: {
    internal: {
      requests: 1000,
      windowMs: 60 * 1000, // 1 minute
    },
    external: {
      requests: 100,
      windowMs: 60 * 1000, // 1 minute
    },
    public: {
      requests: 10,
      windowMs: 60 * 1000, // 1 minute
    },
  },

  // Routes configuration
  routes: {
    // Routes that don't require authentication
    publicRoutes: ["/api/health", "/api/status"],

    // Routes that only allow internal access
    internalOnlyRoutes: ["/api/admin", "/api/internal", "/api/cron"],

    // Routes that require external authentication
    externalRoutes: ["/api/external", "/api/webhook"],

    // Routes that always require API key authentication (even from internal origins)
    alwaysRequireApiKey: [
      "/api/packages",
      "/api/hotels",
      "/api/cities",
      "/api/airlines",
      "/api/filters",
      "/api/crypto",
    ],
  },

  // CORS settings for external providers
  cors: {
    allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "X-API-Key"],
    maxAge: 86400, // 24 hours
  },

  // Security settings
  security: {
    requireHttps: process.env.NODE_ENV === "production",
    validateOrigin: true,
    logFailedAttempts: true,
    maxFailedAttempts: 10,
    lockoutDurationMs: 15 * 60 * 1000, // 15 minutes
  },

  // Monitoring and logging
  monitoring: {
    logSuccessfulAuth: false,
    logFailedAuth: true,
    logRateLimitExceeded: true,
    metricsEnabled: true,
  },
};

/**
 * Get route configuration for a specific path
 * @param {string} pathname - The route pathname
 * @returns {Object} Route configuration
 */
export function getRouteConfig(pathname) {
  const config = {
    requireAuth: true,
    allowInternal: true,
    allowExternal: true,
    isPublic: false,
    isInternalOnly: false,
    isExternalOnly: false,
    alwaysRequireApiKey: false,
  };

  // Check if route is public
  if (
    AuthConfig.routes.publicRoutes.some((route) => pathname.startsWith(route))
  ) {
    config.requireAuth = false;
    config.isPublic = true;
  }

  // Check if route always requires API key (even from internal origins)
  if (
    AuthConfig.routes.alwaysRequireApiKey.some((route) =>
      pathname.startsWith(route)
    )
  ) {
    config.alwaysRequireApiKey = true;
  }

  // Check if route is internal only
  if (
    AuthConfig.routes.internalOnlyRoutes.some((route) =>
      pathname.startsWith(route)
    )
  ) {
    config.allowExternal = false;
    config.isInternalOnly = true;
  }

  // Check if route is external only
  if (
    AuthConfig.routes.externalRoutes.some((route) => pathname.startsWith(route))
  ) {
    config.allowInternal = false;
    config.isExternalOnly = true;
  }

  return config;
}

/**
 * Validate environment configuration
 * @returns {Object} Validation result
 */
export function validateConfig() {
  const errors = [];
  const warnings = [];

  // Check required environment variables
  if (!process.env.NEXT_PUBLIC_API_KEY) {
    warnings.push(
      "NEXT_PUBLIC_API_KEY not set - internal authentication may not work"
    );
  }

  // Check if any external API keys are configured
  const externalKeys = Object.keys(process.env).filter((key) =>
    key.startsWith(AuthConfig.apiKeys.externalKeyPrefix)
  );

  if (externalKeys.length === 0) {
    warnings.push(
      "No external API keys configured - external providers cannot authenticate"
    );
  }

  // Check HTTPS in production
  if (
    AuthConfig.security.requireHttps &&
    process.env.NODE_ENV === "production"
  ) {
    if (!process.env.NEXT_PUBLIC_URL?.startsWith("https://")) {
      errors.push(
        "HTTPS required in production but NEXT_PUBLIC_URL does not use HTTPS"
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    externalKeysCount: externalKeys.length,
  };
}
