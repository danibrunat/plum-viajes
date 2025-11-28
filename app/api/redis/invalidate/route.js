import { NextResponse } from "next/server";
import RedisService from "../../services/redis.service";
import CacheKeysService from "../../services/cache/cacheKeys.service";

/**
 * POST /api/redis/invalidate
 * Invalida claves de cache en Redis por patrones o por pkgId
 *
 * Body:
 * - patterns: Array de patrones a invalidar (soporta wildcards *)
 * - keys: Array de claves específicas a eliminar
 * - pkgId: ID del paquete para invalidar su cache de detail (opcional)
 * - invalidateAvailability: Si invalidar también availability (default: true)
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      patterns = [], 
      keys = [], 
      pkgId, 
      invalidateAvailability = true 
    } = body;

    if (!Array.isArray(patterns) && !Array.isArray(keys) && !pkgId) {
      return NextResponse.json(
        { error: "Debe proporcionar 'patterns', 'keys' o 'pkgId'" },
        { status: 400 }
      );
    }

    const deletedKeys = [];
    const allPatterns = [...patterns];

    // Si se proporciona pkgId, agregar patrones de invalidación automáticamente
    if (pkgId) {
      const detailPattern = CacheKeysService.packages.detailInvalidationPattern(pkgId);
      allPatterns.push(detailPattern);
      console.log(`📦 Invalidando cache de detail para paquete: ${pkgId}`);
      
      if (invalidateAvailability) {
        allPatterns.push("pkg:avail:*");
        console.log(`🔍 Invalidando cache de availability`);
      }
    }

    // 1. Eliminar por patrones (con wildcard)
    for (const pattern of allPatterns) {
      console.log(`🔍 Buscando claves con patrón: ${pattern}`);
      const matchingKeys = await RedisService.getKeysByPattern(pattern);

      if (matchingKeys && matchingKeys.length > 0) {
        console.log(`📋 Encontradas ${matchingKeys.length} claves para: ${pattern}`);
        await RedisService.deleteMultiple(matchingKeys);
        deletedKeys.push(...matchingKeys);
      }
    }

    // 2. Eliminar claves específicas
    if (keys.length > 0) {
      console.log(`🗑️ Eliminando ${keys.length} claves específicas`);
      await RedisService.deleteMultiple(keys);
      deletedKeys.push(...keys);
    }

    return NextResponse.json({
      success: true,
      message: `Cache invalidado exitosamente`,
      deletedCount: deletedKeys.length,
      deletedKeys: deletedKeys,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error("Error en POST /api/redis/invalidate:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
