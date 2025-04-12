import { NextResponse } from "next/server";
import { applyRateLimit } from "./app/helpers/middleware/reteLimit";
import { checkApiKey } from "./app/helpers/middleware/checkApiKey";
import { setSecurityHeaders } from "./app/helpers/middleware/securityHeaders";
import {
  MAINTENANCE_MODE,
  MAINTENANCE_EXCLUDED_PATHS,
} from "./app/constants/maintenance";

// Lista de dominios permitidos
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3333",
  "http://localhost:3001",
  "https://plum-viajes.vercel.app",
  "https://plumviajes.sanity.studio",
];

// Valor por defecto para llamadas internas sin header "origin"
const defaultOrigin = "https://plum-viajes.vercel.app";

export async function middleware(req) {
  // Verificar si el sitio está en modo mantenimiento
  if (MAINTENANCE_MODE) {
    const path = req.nextUrl.pathname;

    // Verificar si la ruta no está excluida del modo mantenimiento
    const isExcluded = MAINTENANCE_EXCLUDED_PATHS.some((excludedPath) =>
      path.startsWith(excludedPath)
    );

    // Si ya estamos en la página de mantenimiento o la ruta está excluida, permitir acceso
    if (path === "/maintenance" || isExcluded) {
      // Continuar con el flujo normal para rutas de API
      if (path.startsWith("/api/")) {
        // Aplicar configuración CORS para APIs
        const origin = req.headers.get("origin");
        const res = NextResponse.next();

        // Agregar política de referer más permisiva
        res.headers.set("Referrer-Policy", "no-referrer-when-downgrade");

        // Si no hay origin (llamada interna) o si el origin está permitido
        if (!origin || allowedOrigins.includes(origin)) {
          res.headers.set(
            "Access-Control-Allow-Origin",
            origin || defaultOrigin
          );
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

      return NextResponse.next();
    }

    // Redirigir a la página de mantenimiento
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  // Modo normal - Continuar con el middleware original
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
  matcher: [
    /*
     * Coincide con todas las rutas de la aplicación excepto:
     * 1. Las que empiezan con /api/ (exponer APIs incluso en modo mantenimiento)
     * 2. Las que tienen una extensión (recursos estáticos)
     * Esto garantiza que las API sigan funcionando durante el mantenimiento
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
