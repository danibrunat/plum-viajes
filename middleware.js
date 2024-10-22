import { NextResponse } from "next/server";
import { applyRateLimit } from "./app/helpers/middleware/reteLimit";
import { checkApiKey } from "./app/helpers/middleware/checkApiKey";
import { setSecurityHeaders } from "./app/helpers/middleware/securityHeaders";

export async function middleware(req) {
  const res = NextResponse.next();

  // Apply rate limiting
  const rateLimitError = await applyRateLimit(req);
  if (rateLimitError) return rateLimitError;

  // Check API key
  const apiKeyError = checkApiKey(req);
  if (apiKeyError) return apiKeyError;

  // Set security headers
  setSecurityHeaders(req, res);

  return res;
}

export const config = {
  matcher: "/api/:path*", // Apply to all API routes
};
