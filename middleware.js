import { NextResponse } from "next/server";
import { applyRateLimit } from "./app/helpers/middleware/reteLimit";
import { checkApiKey } from "./app/helpers/middleware/checkApiKey";
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
  const path = req.nextUrl.pathname;

  // Verificar si es una ruta de API que siempre debe procesarse
  const isApiRoute = path.startsWith("/api/");

  // Verificar si el sitio está en modo mantenimiento
  if (MAINTENANCE_MODE) {
    // Verificar si la ruta no está excluida del modo mantenimiento
    const isExcluded = MAINTENANCE_EXCLUDED_PATHS.some((excludedPath) =>
      path.startsWith(excludedPath)
    );

    // Si ya estamos en la página de mantenimiento o la ruta está excluida, permitir acceso
    if (path === "/maintenance" || isExcluded) {
      // Continuar con el flujo normal para rutas de API
      if (isApiRoute) {
        return await processApiRequest(req);
      }

      return NextResponse.next();
    }

    // Redirigir a la página de mantenimiento
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  // Modo normal - Procesar rutas de API siempre
  if (isApiRoute) {
    return await processApiRequest(req);
  }

  // Para rutas no-API en modo normal, continuar sin procesamiento especial
  return NextResponse.next();
}

async function processApiRequest(req) {
  // Aplicar configuración CORS para APIs
  const origin = req.headers.get("origin");
  const method = req.method;

  // Manejar preflight OPTIONS requests
  if (method === "OPTIONS") {
    if (!origin || allowedOrigins.includes(origin)) {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": origin || defaultOrigin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Authorization, Content-Type, X-API-Key",
          "Access-Control-Max-Age": "86400",
        },
      });
    } else {
      return new Response(null, {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const res = NextResponse.next();

  // Agregar política de referer más permisiva
  res.headers.set("Referrer-Policy", "no-referrer-when-downgrade");

  // Si no hay origin (llamada interna) o si el origin está permitido
  if (!origin || allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin || defaultOrigin);
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type, X-API-Key"
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

  // Verificar clave API usando el nuevo sistema
  const apiKeyError = await checkApiKey(req);
  if (apiKeyError) return apiKeyError;

  return res;
}

export const config = {
  matcher: [
    /*
     * Coincide con:
     * 1. Todas las rutas de API (/api/*)
     * 2. Todas las demás rutas excepto recursos estáticos
     * Esto garantiza que las APIs siempre tengan autenticación
     */
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
