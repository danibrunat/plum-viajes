import { AuthMiddleware } from "../../lib/auth/middleware.js";

export async function checkApiKey(req) {
  // Use the new authentication system
  const authResult = await AuthMiddleware.authenticate(req, {
    requireAuth: true,
    allowInternal: true, // Permitir acceso interno, pero la lógica granular está en AuthMiddleware
  });

  if (!authResult.success) {
    return AuthMiddleware.createAuthResponse(authResult);
  }

  return null; // Success, continue processing
}

// Legacy function for backward compatibility
export function checkApiKeyLegacy(req) {
  const authorization = req.headers.get("authorization");
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const authorizationKey = `Bearer ${apiKey}`;

  if (!authorization || authorization !== authorizationKey) {
    return Response.json(
      { error: true, reason: "Unauthorized" },
      { status: 401 }
    );
  }
}
