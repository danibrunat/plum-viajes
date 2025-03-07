import { NextResponse } from "next/server";
import { applyRateLimit } from "./app/helpers/middleware/reteLimit";
import { checkApiKey } from "./app/helpers/middleware/checkApiKey";
import { setSecurityHeaders } from "./app/helpers/middleware/securityHeaders";

// Lista de dominios permitidos
const allowedOrigins = [
  "http://localhost:3000",
  "https://plum-viajes.vercel.app",
  "https://plumviajes.sanity.studio",
];

// Middleware para CORS
export async function middleware(req) {
  const origin = req.headers.get("origin");
  const res = NextResponse.next();
  console.log("origin", origin);
  // Añadir una política de referer más permisiva
  res.headers.set("Referrer-Policy", "no-referrer-when-downgrade");

  // Verificar si el origen está permitido
  if (allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type"
    );
  } else {
    return new NextResponse(
      JSON.stringify({ error: "CORS Error: Origin not allowed" }),
      {
        status: 403,
      }
    );
  }

  // Manejar las solicitudes preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      headers: res.headers,
      status: 204, // No Content, preflight exitoso
    });
  }

  // Aplicar limitación de tasa
  const rateLimitError = await applyRateLimit(req);
  if (rateLimitError) return rateLimitError;

  // Verificar clave API
  const apiKeyError = checkApiKey(req);
  if (apiKeyError) return apiKeyError;

  // Configurar encabezados de seguridad
  setSecurityHeaders(req, res);

  return res;
}

export const config = {
  matcher: "/api/:path*", // Aplicar a todas las rutas API
};
