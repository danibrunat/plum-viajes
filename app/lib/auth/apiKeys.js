/**
 * API Key Management System
 * Handles external provider authentication
 */

export class ApiKeyManager {
  constructor() {
    this.internalKeys = [
      process.env.NEXT_PUBLIC_API_KEY,
      process.env.SANITY_STUDIO_NEXT_API_KEY,
    ].filter(Boolean);

    this.externalKeys = this.loadExternalKeys();
  }

  /**
   * Load external API keys from environment variables
   * Format: EXTERNAL_API_KEY_[PROVIDER_NAME]=key
   */
  loadExternalKeys() {
    const keys = new Map();

    // Load from environment variables
    Object.entries(process.env).forEach(([key, value]) => {
      if (key.startsWith("EXTERNAL_API_KEY_") && value) {
        const providerName = key.replace("EXTERNAL_API_KEY_", "").toLowerCase();
        keys.set(value, {
          provider: providerName,
          key: value,
          isActive: true,
          createdAt: new Date().toISOString(),
        });
      }
    });

    return keys;
  }

  /**
   * Validate if API key is authorized
   * @param {string} apiKey - The API key to validate
   * @param {string} context - Context: 'internal' or 'external'
   * @returns {Object} Validation result
   */
  validateApiKey(apiKey, context = "external") {
    if (!apiKey) {
      return {
        isValid: false,
        error: "API key is required",
        code: "MISSING_API_KEY",
      };
    }

    // Check internal keys (for backward compatibility)
    if (context === "internal" || this.internalKeys.includes(apiKey)) {
      return {
        isValid: true,
        type: "internal",
        provider: "internal",
      };
    }

    // Check external keys
    const keyData = this.externalKeys.get(apiKey);
    if (keyData && keyData.isActive) {
      return {
        isValid: true,
        type: "external",
        provider: keyData.provider,
        keyData,
      };
    }

    return {
      isValid: false,
      error: "Invalid or inactive API key",
      code: "INVALID_API_KEY",
    };
  }

  /**
   * Extract API key from request headers
   * @param {Request} request - The request object
   * @returns {string|null} The extracted API key
   */
  extractApiKey(request) {
    const authorization = request.headers.get("authorization");
    const apiKeyHeader = request.headers.get("x-api-key");

    // Check Bearer token format
    if (authorization?.startsWith("Bearer ")) {
      return authorization.substring(7);
    }

    // Check x-api-key header
    if (apiKeyHeader) {
      return apiKeyHeader;
    }

    return null;
  }

  /**
   * Check if origin is internal (same domain)
   * @param {Request} request - The request object
   * @returns {boolean} True if internal origin
   */
  isInternalOrigin(request) {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");

    // If no origin, it's likely internal (server-to-server)
    if (!origin && !referer) {
      return true;
    }

    const allowedInternalOrigins = [
      process.env.NEXT_PUBLIC_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      "http://localhost:3000",
      "http://localhost:3333",
      "http://localhost:3001",
    ].filter(Boolean);

    return allowedInternalOrigins.some(
      (allowedOrigin) =>
        origin?.startsWith(allowedOrigin) || referer?.startsWith(allowedOrigin)
    );
  }

  /**
   * Get API key statistics (for monitoring)
   * @returns {Object} Usage statistics
   */
  getStats() {
    return {
      totalExternalKeys: this.externalKeys.size,
      activeExternalKeys: Array.from(this.externalKeys.values()).filter(
        (key) => key.isActive
      ).length,
      providers: Array.from(this.externalKeys.values()).map(
        (key) => key.provider
      ),
    };
  }
}

// Singleton instance
export const apiKeyManager = new ApiKeyManager();
