#!/usr/bin/env node

/**
 * Script de prueba para verificar la autenticación de APIs
 *
 * Uso:
 *   node scripts/test-auth.js
 */

const API_BASE_URL = "http://localhost:3000";
const TEST_API_KEY =
  "sk_bdc20eac057510b7d5246497651f36391b00c7ce6575514a031a1ebb54820909";

async function testEndpoint(endpoint, headers = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    return {
      status: response.status,
      ok: response.ok,
      data: response.ok ? await response.json() : await response.text(),
    };
  } catch (error) {
    return {
      status: "ERROR",
      ok: false,
      error: error.message,
    };
  }
}

async function runTests() {
  console.log("🧪 Probando autenticación de APIs...\n");

  // Test 1: Endpoint que requiere API key SIN token
  console.log("📋 Test 1: Endpoint /api/cities/autocomplete SIN API key");
  const test1 = await testEndpoint(
    "/api/cities/autocomplete?query=canc%C3%BAn&input=arrivalCity"
  );
  console.log(`   Status: ${test1.status}`);
  console.log(
    `   Resultado: ${test1.ok ? "❌ PERMITIDO (MAL)" : "✅ BLOQUEADO (BIEN)"}`
  );
  if (!test1.ok) {
    console.log(`   Mensaje: ${test1.data}`);
  }
  console.log();

  // Test 2: Endpoint que requiere API key CON token válido
  console.log(
    "📋 Test 2: Endpoint /api/cities/autocomplete CON API key válida"
  );
  const test2 = await testEndpoint(
    "/api/cities/autocomplete?query=canc%C3%BAn&input=arrivalCity",
    {
      Authorization: `Bearer ${TEST_API_KEY}`,
    }
  );
  console.log(`   Status: ${test2.status}`);
  console.log(
    `   Resultado: ${test2.ok ? "✅ PERMITIDO (BIEN)" : "❌ BLOQUEADO (MAL)"}`
  );
  if (!test2.ok) {
    console.log(`   Mensaje: ${test2.data}`);
  }
  console.log();

  // Test 3: Endpoint que requiere API key CON token inválido
  console.log(
    "📋 Test 3: Endpoint /api/cities/autocomplete CON API key inválida"
  );
  const test3 = await testEndpoint(
    "/api/cities/autocomplete?query=canc%C3%BAn&input=arrivalCity",
    {
      Authorization: `Bearer sk_invalid_key_12345`,
    }
  );
  console.log(`   Status: ${test3.status}`);
  console.log(
    `   Resultado: ${test3.ok ? "❌ PERMITIDO (MAL)" : "✅ BLOQUEADO (BIEN)"}`
  );
  if (!test3.ok) {
    console.log(`   Mensaje: ${test3.data}`);
  }
  console.log();

  // Test 4: Endpoint público (debería funcionar sin token)
  console.log("📋 Test 4: Endpoint público /api/health (si existe)");
  const test4 = await testEndpoint("/api/health");
  console.log(`   Status: ${test4.status}`);
  console.log(
    `   Resultado: ${test4.ok ? "✅ PERMITIDO (BIEN)" : "⚠️ ENDPOINT NO EXISTE"}`
  );
  console.log();

  // Test 5: Endpoint con X-API-Key header
  console.log(
    "📋 Test 5: Endpoint /api/cities/autocomplete CON X-API-Key header"
  );
  const test5 = await testEndpoint(
    "/api/cities/autocomplete?query=canc%C3%BAn&input=arrivalCity",
    {
      "X-API-Key": TEST_API_KEY,
    }
  );
  console.log(`   Status: ${test5.status}`);
  console.log(
    `   Resultado: ${test5.ok ? "✅ PERMITIDO (BIEN)" : "❌ BLOQUEADO (MAL)"}`
  );
  if (!test5.ok) {
    console.log(`   Mensaje: ${test5.data}`);
  }
  console.log();

  // Resumen
  console.log("📊 Resumen de pruebas:");
  console.log("   • Sin API key: Debería estar BLOQUEADO");
  console.log("   • Con API key válida: Debería estar PERMITIDO");
  console.log("   • Con API key inválida: Debería estar BLOQUEADO");
  console.log("   • Endpoints públicos: Deberían estar PERMITIDOS");
  console.log(
    "   • Header X-API-Key: Debería funcionar igual que Authorization"
  );
  console.log();
  console.log("💡 Si algún test no pasa como esperado, revisa:");
  console.log("   1. Que el servidor esté corriendo (npm run dev)");
  console.log("   2. Que hayas agregado la API key al .env");
  console.log("   3. Que hayas reiniciado el servidor después de cambios");
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testEndpoint };
