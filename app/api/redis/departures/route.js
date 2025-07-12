import { NextRequest, NextResponse } from "next/server";
import PackageApiService from "../../services/packages.service";
import { getTTL } from "../../../constants/cachePolicies";

export async function POST(req) {
  try {
    const body = await req.json();
    const { pkgDepartures, expireInSeconds, longTerm = false } = body;

    if (!Array.isArray(pkgDepartures)) {
      return NextResponse.json(
        { error: "pkgDepartures debe ser un array" },
        { status: 400 }
      );
    }

    // Usar políticas centralizadas o valor personalizado
    const ttl =
      expireInSeconds ||
      getTTL(longTerm ? "PACKAGES_DEPARTURES_LONG" : "PACKAGES_DEPARTURES");

    await PackageApiService.cache.setIfNotExists(pkgDepartures, ttl);

    return NextResponse.json({
      success: true,
      message: `Departures cacheados si no existían (TTL: ${ttl}s).`,
      ttl: ttl,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error("Error en POST /api/cache/departures:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
