import { auth, validateConfig } from "../../../lib/auth/index.js";

/**
 * Authentication system status endpoint
 * Internal-only for monitoring the auth system
 */
export async function GET(request, context) {
  const configValidation = validateConfig();
  const stats = auth.keyManager.getStats();

  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    config: {
      isValid: configValidation.isValid,
      errors: configValidation.errors,
      warnings: configValidation.warnings,
      externalKeysConfigured: configValidation.externalKeysCount,
    },
    stats: {
      totalExternalKeys: stats.totalExternalKeys,
      activeExternalKeys: stats.activeExternalKeys,
      providers: stats.providers,
    },
    version: "1.0.0",
  });
}
