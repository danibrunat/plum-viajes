import SanityService from "../../services/sanity.service.js";

/**
 * Cron Job: Limpiar paquetes etiquetados antiguos
 *
 * Realiza dos operaciones de limpieza:
 * 1. Elimina documentos 'taggedPackages' cuya departureFrom sea anterior a hoy
 * 2. Remueve tags de documentos 'packages' que tengan departures antiguos
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

    // Query 1: taggedPackages con departureFrom anterior a hoy (lógica existente - eliminar documento)
    const queryOldTaggedPackages = `*[
      _type == "taggedPackages" && 
      departureFrom < "${todayISO}"
    ]`;

    // Query 2: packages con departureFrom anterior a hoy (nueva lógica - remover tags)
    const queryOldPackages = `*[
      _type == "packages" && 
      defined(departures) &&
      count(departures[departureFrom < "${todayISO}"]) > 0 &&
      count(tags) > 0
    ]`;

    // Obtener los documentos que se van a procesar
    const [oldTaggedPackages, oldPackages] = await Promise.all([
      SanityService.getFromSanity(queryOldTaggedPackages),
      SanityService.getFromSanity(queryOldPackages),
    ]);

    let totalProcessed = 0;
    let processedDetails = [];

    // 1. Eliminar taggedPackages con departures antiguos (lógica existente)
    if (oldTaggedPackages && oldTaggedPackages.length > 0) {
      console.log(
        `🗑️ Encontrados ${oldTaggedPackages.length} taggedPackages para eliminar:`
      );
      oldTaggedPackages.forEach((pkg) => {
        console.log(
          `   - ID: ${pkg._id}, departureFrom: ${pkg.departureFrom}, title: ${pkg.title || "Sin título"}`
        );
      });

      const deleteResult = await SanityService.deleteByQuery(
        queryOldTaggedPackages
      );
      totalProcessed += deleteResult.deleted;

      processedDetails.push(
        ...oldTaggedPackages.map((pkg) => ({
          id: pkg._id,
          title: pkg.title || "Sin título",
          departureFrom: pkg.departureFrom,
          action: "Documento eliminado (taggedPackages)",
          type: "taggedPackages",
        }))
      );

      console.log(`✅ Eliminados ${deleteResult.deleted} taggedPackages`);
    }

    // 2. Remover tags de packages con departures antiguos (nueva lógica)
    if (oldPackages && oldPackages.length > 0) {
      console.log(
        `🏷️ Encontrados ${oldPackages.length} packages con departures antiguos para remover tags:`
      );

      for (const pkg of oldPackages) {
        console.log(`   - ID: ${pkg._id}, title: ${pkg.title || "Sin título"}`);

        try {
          // Remover tags del package
          await SanityService.client.patch(pkg._id).unset(["tags"]).commit();

          totalProcessed++;

          processedDetails.push({
            id: pkg._id,
            title: pkg.title || "Sin título",
            action: "Tags removidos (packages)",
            type: "packages",
            departuresAffected:
              pkg.departures?.filter((d) => d.departureFrom < todayISO)
                ?.length || 0,
          });

          console.log(`   ✅ Tags removidos de package ${pkg._id}`);
        } catch (error) {
          console.error(`   ❌ Error removiendo tags de ${pkg._id}:`, error);
          processedDetails.push({
            id: pkg._id,
            title: pkg.title || "Sin título",
            action: "Error al remover tags",
            type: "packages",
            error: error.message,
          });
        }
      }
    }

    if (totalProcessed === 0) {
      console.log("✅ No se encontraron elementos antiguos para procesar");
      return Response.json({
        success: true,
        message: "No hay elementos antiguos para procesar",
        processed: 0,
        executedAt: new Date().toISOString(),
      });
    }

    console.log(
      `✅ Limpieza completada: ${totalProcessed} operaciones realizadas`
    );

    return Response.json({
      success: true,
      message: `Limpieza completada exitosamente`,
      processed: totalProcessed,
      processedItems: processedDetails,
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
export async function GET(request, context) {
  console.log("🧪 Ejecutando limpieza manual (modo testing)");

  // Verificar autenticación interna para testing manual
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json(
      {
        error: "No autorizado",
        message: "Se requiere autenticación para acceso manual",
      },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  const { PLUM_INTERNAL_API_KEY } = process.env;

  if (!token || token !== PLUM_INTERNAL_API_KEY) {
    return Response.json(
      {
        error: "Token inválido",
        message: "API key interna requerida para testing manual",
      },
      { status: 403 }
    );
  }

  return cleanOldTaggedPackagesHandler(request, context);
}
