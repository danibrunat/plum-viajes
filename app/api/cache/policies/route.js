import { NextResponse } from "next/server";
import CACHE_POLICIES, { getTTL } from "../../../constants/cachePolicies";
import CacheService from "../../services/cache/cache.service";

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
    const { action, pattern, type, packageData } = body;

    switch (action) {
      case "invalidate":
        // Invalidación por patrón general
        return NextResponse.json({
          success: true,
          message: `Cache invalidation queued for pattern: ${pattern}`,
          timestamp: new Date().toISOString(),
        });

      case "invalidate-package":
        // Invalidación específica para paquetes
        if (!packageData) {
          return NextResponse.json(
            { error: "packageData is required for package invalidation" },
            { status: 400 }
          );
        }

        try {
          const result =
            await CacheService.packages.invalidateByPackageCriteria(
              packageData
            );
          return NextResponse.json({
            success: true,
            message: "Package cache invalidated successfully",
            result,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Error invalidating package cache:", error);
          return NextResponse.json(
            {
              error: "Failed to invalidate package cache",
              details: error.message,
            },
            { status: 500 }
          );
        }

      case "invalidate-package-id":
        // Invalidación por ID específico de paquete
        const { packageId } = body;
        if (!packageId) {
          return NextResponse.json(
            { error: "packageId is required" },
            { status: 400 }
          );
        }

        try {
          const result =
            await CacheService.packages.invalidatePackageById(packageId);
          return NextResponse.json({
            success: true,
            message: `Package ${packageId} cache invalidated`,
            result,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Error invalidating package by ID:", error);
          return NextResponse.json(
            {
              error: "Failed to invalidate package cache",
              details: error.message,
            },
            { status: 500 }
          );
        }

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
