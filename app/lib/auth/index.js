/**
 * Main authentication module
 * Exports all authentication functionality
 */

export { apiKeyManager, ApiKeyManager } from "./apiKeys.js";
export { AuthMiddleware } from "./middleware.js";
export { AuthUtils, AuthDecorators } from "./utils.js";
export { AuthConfig, getRouteConfig, validateConfig } from "./config.js";

// Convenience exports for common use cases
export const auth = {
  // Protect API routes
  protect: AuthUtils.protect,
  public: AuthUtils.public,
  internal: AuthUtils.internal,
  external: AuthUtils.external,

  // Validation
  validate: AuthUtils.validate,

  // Context helpers
  getAuthInfo: AuthUtils.getAuthInfo,
  isInternal: AuthUtils.isInternal,
  isExternal: AuthUtils.isExternal,
  getProvider: AuthUtils.getProvider,

  // Manager instance
  keyManager: apiKeyManager,

  // Configuration
  config: AuthConfig,
};

// Default export
export default auth;
