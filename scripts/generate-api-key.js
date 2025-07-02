#!/usr/bin/env node

/**
 * Generador de API Keys para Plum Viajes
 *
 * Uso:
 *   node scripts/generate-api-key.js [nombre-proveedor]
 *
 * Ejemplo:
 *   node scripts/generate-api-key.js booking-partner
 */

const crypto = require("crypto");

function generateApiKey() {
  return "sk_" + crypto.randomBytes(32).toString("hex");
}

function generateProviderConfig(providerName) {
  const apiKey = generateApiKey();
  const envVarName = `EXTERNAL_API_KEY_${providerName.toUpperCase().replace(/-/g, "_")}`;

  return {
    providerName,
    apiKey,
    envVarName,
    envLine: `${envVarName}=${apiKey}`,
  };
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("🔑 Generador de API Keys para Plum Viajes\n");
    console.log("Uso:");
    console.log("  node scripts/generate-api-key.js [nombre-proveedor]\n");
    console.log("Ejemplo:");
    console.log("  node scripts/generate-api-key.js booking-partner\n");
    console.log("Generando API key genérica...\n");

    const genericKey = generateApiKey();
    console.log("🔐 API Key generada:");
    console.log(genericKey);
    console.log("\n📋 Para usarla, agrégala al archivo .env como:");
    console.log(`EXTERNAL_API_KEY_[NOMBRE_PROVEEDOR]=${genericKey}`);
    return;
  }

  const providerName = args[0];
  const config = generateProviderConfig(providerName);

  console.log("🔑 Nueva API Key generada para:", config.providerName);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("🔐 API Key:");
  console.log(config.apiKey);
  console.log("");
  console.log("📋 Variable de entorno:");
  console.log(config.envVarName);
  console.log("");
  console.log("📝 Línea para agregar al archivo .env:");
  console.log(config.envLine);
  console.log("");
  console.log("🚀 Pasos siguientes:");
  console.log("1. Agrega la línea anterior al archivo .env");
  console.log("2. Reinicia el servidor de desarrollo");
  console.log("3. Entrega la API Key al proveedor");
  console.log(
    "4. El proveedor debe usar: Authorization: Bearer " + config.apiKey
  );
  console.log("");
  console.log("📖 Para más información consulta: API_AUTHENTICATION.md");
}

if (require.main === module) {
  main();
}

module.exports = {
  generateApiKey,
  generateProviderConfig,
};
