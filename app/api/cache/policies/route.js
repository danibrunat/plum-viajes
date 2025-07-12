import { NextResponse } from "next/server";
import CACHE_POLICIES, { getTTL } from "../../../constants/cachePolicies";

/**
 * Endpoint para consultar y gestionar políticas de cache
 * GET: Obtiene las políticas actuales
 * POST: Permite invalidar cache por patrones (futuro)
 */

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const env = searchParams.get("env") || process.env.NODE_ENV;

  if (type) {
    // Obtener TTL específico para un tipo
    const ttl = getTTL(type, env);
    return NextResponse.json({
      type,
      ttl,
      environment: env,
      ttlHuman: `${Math.floor(ttl / 60)} minutos`,
    });
  }

  // Devolver todas las políticas con TTLs calculados
  const currentPolicies = {
    ...CACHE_POLICIES,
    calculatedTTLs: {},
    environment: env,
  };

  // Calcular TTLs para el entorno actual
  Object.keys(CACHE_POLICIES.TTL).forEach((key) => {
    const ttl = getTTL(key, env);
    currentPolicies.calculatedTTLs[key] = {
      seconds: ttl,
      minutes: Math.floor(ttl / 60),
      hours: Math.floor(ttl / 3600),
    };
  });

  return NextResponse.json(currentPolicies);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, pattern, type } = body;

    switch (action) {
      case "invalidate":
        // Aquí implementarías la invalidación por patrón
        return NextResponse.json({
          success: true,
          message: `Cache invalidation queued for pattern: ${pattern}`,
          timestamp: new Date().toISOString(),
        });

      case "stats":
        // Aquí implementarías estadísticas de cache
        return NextResponse.json({
          stats: {
            totalKeys: 0, // Implementar
            hitRate: 0, // Implementar
            environment: process.env.NODE_ENV,
            policies: Object.keys(CACHE_POLICIES.TTL).length,
          },
        });

      default:
        return NextResponse.json(
          { error: "Action not supported" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in cache policies endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
