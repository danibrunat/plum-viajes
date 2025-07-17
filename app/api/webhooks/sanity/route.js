import { NextResponse } from "next/server";
import CacheService from "../../services/cache/cache.service";

/**
 * Webhook endpoint para recibir eventos desde Sanity
 * Este endpoint se activará automáticamente cuando:
 * - Se cree un nuevo paquete
 * - Se actualice un paquete existente
 * - Se publique un paquete
 */

export async function POST(req) {
  try {
    // Verificar origen del webhook (opcional pero recomendado)
    const signature = req.headers.get("sanity-webhook-signature");
    const sanitySecret = process.env.SANITY_WEBHOOK_SECRET;

    if (sanitySecret && signature) {
      // Aquí puedes implementar verificación de signature si es necesario
      // const isValid = verifySignature(signature, body, sanitySecret);
      // if (!isValid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = await req.json();
    console.log(
      "📨 Webhook recibido desde Sanity:",
      JSON.stringify(body, null, 2)
    );

    // El documento viene directamente en el body, no envuelto
    const document = body;

    // Solo procesar eventos de paquetes
    if (document._type !== "packages") {
      console.log("ℹ️ Evento ignorado: no es un paquete");
      return NextResponse.json({
        success: true,
        message: "Event ignored - not a package",
      });
    }

    console.log(`🔄 Procesando webhook para paquete ${document._id}`);
    console.log(`📦 Información del paquete:`, {
      id: document._id,
      title: document.title,
      origins: document.origin,
      destinationsCount: document.destination?.length || 0,
      departuresCount: document.departures?.length || 0,
    });

    // Invalidar cache relacionado con el paquete
    const invalidationResult =
      await CacheService.packages.invalidateByPackageCriteria({
        _id: document._id,
        title: document.title,
        destination: document.destination,
        origin: document.origin,
        departures: document.departures || [],
        provider: "plum",
      });

    console.log("✅ Cache invalidado exitosamente:");
    console.log(`   🗑️ Claves eliminadas: ${invalidationResult.deletedKeys}`);
    console.log(
      `   🔍 Búsquedas invalidadas: ${invalidationResult.searchesInvalidated}`
    );
    console.log(`   📍 Orígenes: ${(document.origin || []).join(", ")}`);
    console.log(
      `   🎯 Destinos: ${document.destination?.length || 0} referencias`
    );

    return NextResponse.json({
      success: true,
      message: "Package cache invalidated successfully",
      package: {
        id: document._id,
        title: document.title,
        origins: document.origin,
        destinationsCount: document.destination?.length || 0,
      },
      invalidation: {
        ...invalidationResult,
        summary: `Invalidated ${invalidationResult.searchesInvalidated} searches and ${invalidationResult.deletedKeys} total cache keys`,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error procesando webhook de Sanity:", error);
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET para testing del webhook
export async function GET(req) {
  return NextResponse.json({
    message: "Sanity webhook endpoint is active",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
