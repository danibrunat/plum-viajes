import { NextResponse } from "next/server";
import { applyRateLimit } from "./app/helpers/middleware/reteLimit";
import { checkApiKey } from "./app/helpers/middleware/checkApiKey";
import { setSecurityHeaders } from "./app/helpers/middleware/securityHeaders";
import Cors from "cors";

// Lista de dominios permitidos
const allowedOrigins = [
  "http://localhost:3000",
  "https://plum-viajes.vercel.app/",
  "https://plumviajes.sanity.studio",
];

// Inicializar CORS
const cors = Cors({
  methods: ["GET", "POST", "HEAD"],
  origin: "*", // Permite temporalmente todos los orígenes para pruebas
  /*  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }, */
});

// Helper para ejecutar middlewares como cors
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export async function middleware(req) {
  const res = NextResponse.next();

  // Aplicar CORS antes de cualquier otra validación
  try {
    await runMiddleware(req, res, cors);
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: "CORS Error" }), {
      status: 403,
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
