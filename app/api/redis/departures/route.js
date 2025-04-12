import { NextRequest, NextResponse } from "next/server";
import PackageApiService from "../../services/packages.service";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("body", body);

    return body;
    const { pkgDepartures, expireInSeconds } = body;

    if (!Array.isArray(pkgDepartures)) {
      return NextResponse.json(
        { error: "pkgDepartures debe ser un array" },
        { status: 400 }
      );
    }

    await PackageApiService.cache.setIfNotExists(
      pkgDepartures,
      expireInSeconds || 100000000 // 100000000 seconds = 1157 days
    );

    return NextResponse.json({
      success: true,
      message: "Departures cacheados si no existían.",
    });
  } catch (error) {
    console.error("Error en POST /api/cache/departures:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
