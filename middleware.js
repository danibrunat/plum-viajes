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

// Valor por defecto para llamadas internas sin header "origin"
const defaultOrigin = "https://plum-viajes.vercel.app";

export async function middleware(req) {
  const origin = req.headers.get("origin");
  const res = NextResponse.next();

  // Agregar política de referer más permisiva
  res.headers.set("Referrer-Policy", "no-referrer-when-downgrade");

  // Si no hay origin (llamada interna) o si el origin está permitido
  if (!origin || allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin || defaultOrigin);
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
        headers: { "Content-Type": "application/json" },
      }
    );
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
