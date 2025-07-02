#!/usr/bin/env node

/**
 * Script para probar el cron job de limpieza de taggedPackages
 *
 * Uso:
 *   node scripts/test-cron-cleanup.js
 */

const API_BASE_URL = "http://localhost:3000";

async function testCronCleanup() {
  console.log("🧪 Probando cron job de limpieza de taggedPackages...\n");

  try {
    // Test con GET (requiere ser interno)
    console.log(
      "📋 Test 1: GET /api/cron/clean-old-tagged-packages (testing manual)"
    );
    const response = await fetch(
      `${API_BASE_URL}/api/cron/clean-old-tagged-packages`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`   Status: ${response.status}`);

    if (response.ok) {
      const result = await response.json();
      console.log(`   ✅ Resultado:`);
      console.log(`      - Eliminados: ${result.deleted}`);
      console.log(`      - Mensaje: ${result.message}`);
      console.log(`      - Ejecutado: ${result.executedAt}`);

      if (result.deletedPackages && result.deletedPackages.length > 0) {
        console.log(`      - Paquetes eliminados:`);
        result.deletedPackages.forEach((pkg) => {
          console.log(`        * ${pkg.title} (${pkg.departureFrom})`);
        });
      }
    } else {
      const error = await response.text();
      console.log(`   ❌ Error: ${error}`);
    }
  } catch (error) {
    console.log(`   💥 Error de conexión: ${error.message}`);
  }

  console.log("\n💡 Notas:");
  console.log(
    "   • El cron job se ejecutará automáticamente todos los días a las 00:00 UTC"
  );
  console.log(
    "   • Solo elimina taggedPackages con departureFrom anterior a hoy"
  );
  console.log("   • GET funciona solo internamente (mismo origen)");
  console.log("   • POST es para Vercel Cron (automático)");
}

if (require.main === module) {
  testCronCleanup().catch(console.error);
}

module.exports = { testCronCleanup };
