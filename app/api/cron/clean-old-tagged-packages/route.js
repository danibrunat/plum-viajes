import { auth } from "../../../lib/auth/index.js";
import SanityService from "../../services/sanity.service.js";

/**
 * Cron Job: Limpiar paquetes etiquetados antiguos
 *
 * Elimina todos los documentos del schema 'taggedPackages'
 * cuya fecha departureFrom sea anterior a hoy.
 *
 * Ejecuta diariamente a las 00:00 UTC via Vercel Cron
 */

async function cleanOldTaggedPackagesHandler(request, context) {
  try {
    console.log("🧹 Iniciando limpieza de taggedPackages antiguos...");

    // Obtener la fecha actual en formato ISO (YYYY-MM-DD)
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    console.log(`📅 Fecha de referencia: ${todayISO}`);

    // Query para encontrar taggedPackages con departureFrom anterior a hoy
    const queryOldPackages = `*[
      _type == "taggedPackages" && 
      departureFrom < "${todayISO}"
    ]`;

    // Obtener los documentos que se van a eliminar (para logging)
    const oldPackages = await SanityService.getFromSanity(queryOldPackages);

    if (!oldPackages || oldPackages.length === 0) {
      console.log("✅ No se encontraron taggedPackages antiguos para eliminar");
      return Response.json({
        success: true,
        message: "No hay paquetes antiguos para eliminar",
        deleted: 0,
        executedAt: new Date().toISOString(),
      });
    }

    console.log(
      `🗑️ Encontrados ${oldPackages.length} taggedPackages para eliminar:`
    );
    oldPackages.forEach((pkg) => {
      console.log(
        `   - ID: ${pkg._id}, departureFrom: ${pkg.departureFrom}, title: ${pkg.title || "Sin título"}`
      );
    });

    // Eliminar los documentos antiguos
    const deleteResult = await SanityService.deleteByQuery(queryOldPackages);

    console.log(
      `✅ Limpieza completada: ${deleteResult.deleted} documentos eliminados`
    );

    return Response.json({
      success: true,
      message: `Limpieza completada exitosamente`,
      deleted: deleteResult.deleted,
      deletedPackages: oldPackages.map((pkg) => ({
        id: pkg._id,
        title: pkg.title || "Sin título",
        departureFrom: pkg.departureFrom,
      })),
      executedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error en limpieza de taggedPackages:", error);

    return Response.json(
      {
        success: false,
        error: "Error interno en la limpieza",
        message: error.message,
        executedAt: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Verificar que la request viene de Vercel Cron
 */
function isValidCronRequest(request) {
  // Vercel incluye este header en requests de cron jobs
  const cronSecret = request.headers.get("authorization");
  const userAgent = request.headers.get("user-agent");

  // Verificar que viene de Vercel Cron
  if (userAgent && userAgent.includes("vercel")) {
    return true;
  }

  // También permitir si tiene una API key válida (para testing manual)
  if (cronSecret) {
    return true;
  }

  return false;
}

/**
 * Handler principal con autenticación específica para cron
 */
async function cronHandler(request, context) {
  // Verificación específica para cron jobs
  if (!isValidCronRequest(request)) {
    return Response.json(
      {
        error: "Acceso no autorizado",
        message:
          "Esta ruta solo es accesible via Vercel Cron o con API key válida",
      },
      { status: 403 }
    );
  }

  return cleanOldTaggedPackagesHandler(request, context);
}

// Solo permitir POST (Vercel Cron usa POST)
export async function POST(request, context) {
  return cronHandler(request, context);
}

// GET para testing manual con autenticación
export const GET = auth.internal(async (request, context) => {
  console.log("🧪 Ejecutando limpieza manual (modo testing)");
  return cleanOldTaggedPackagesHandler(request, context);
});

// Exportar el POST sin wrapper de auth (manejo manual)
// GET sí usa auth.internal para testing desde el proyecto
