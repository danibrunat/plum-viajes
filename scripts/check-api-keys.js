#!/usr/bin/env node

/**
 * Verificador de configuración de API Keys
 *
 * Uso:
 *   node scripts/check-api-keys.js
 */

const fs = require("fs");
const path = require("path");

function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    const vars = {};

    lines.forEach((line) => {
      line = line.trim();
      if (line && !line.startsWith("#")) {
        const [key, ...valueParts] = line.split("=");
        if (key && valueParts.length > 0) {
          vars[key.trim()] = valueParts
            .join("=")
            .trim()
            .replace(/^["']|["']$/g, "");
        }
      }
    });

    return vars;
  } catch (error) {
    return {};
  }
}

function checkApiKeys() {
  const envPath = path.join(process.cwd(), ".env");
  const envVars = loadEnvFile(envPath);

  console.log("🔍 Verificando configuración de API Keys...\n");

  // Verificar API keys internas
  console.log("📋 API Keys Internas:");
  const internalKeys = [
    "NEXT_PUBLIC_API_KEY",
    "SANITY_STUDIO_NEXT_API_KEY",
    "SANITY_API_KEY",
  ];

  internalKeys.forEach((key) => {
    const value = envVars[key];
    if (value) {
      console.log(`  ✅ ${key}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`  ❌ ${key}: NO CONFIGURADA`);
    }
  });

  // Verificar API keys externas
  console.log("\n🌐 API Keys Externas:");
  const externalKeys = Object.keys(envVars)
    .filter((key) => key.startsWith("EXTERNAL_API_KEY_"))
    .sort();

  if (externalKeys.length === 0) {
    console.log("  ℹ️  No hay API keys externas configuradas");
    console.log(
      "  💡 Para agregar una: npm run generate-api-key [nombre-proveedor]"
    );
  } else {
    externalKeys.forEach((key) => {
      const providerName = key.replace("EXTERNAL_API_KEY_", "").toLowerCase();
      const value = envVars[key];
      console.log(`  ✅ ${providerName}: ${value.substring(0, 20)}...`);
    });
  }

  // Verificar configuración de URLs
  console.log("\n🌍 URLs de Aplicación:");
  const urlKeys = [
    "NEXT_PUBLIC_URL",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_BACKEND_URL",
  ];

  urlKeys.forEach((key) => {
    const value = envVars[key];
    if (value) {
      console.log(`  ✅ ${key}: ${value}`);
    } else {
      console.log(`  ❌ ${key}: NO CONFIGURADA`);
    }
  });

  // Verificar servicios externos
  console.log("\n🔌 Servicios Externos:");
  const serviceKeys = [
    "UPSTASH_REDIS_REST_URL",
    "NEXT_PUBLIC_SANITY_PROJECT_ID",
    "NEXT_PUBLIC_RECAPTCHA_KEY",
  ];

  serviceKeys.forEach((key) => {
    const value = envVars[key];
    if (value && value !== "tu_valor_aqui") {
      console.log(`  ✅ ${key}: Configurado`);
    } else {
      console.log(
        `  ⚠️  ${key}: ${value ? "Usar valor de plantilla" : "NO CONFIGURADO"}`
      );
    }
  });

  console.log("\n📖 Para más información consulta: API_AUTHENTICATION.md");
  console.log(
    "🔑 Para generar una nueva API key: npm run generate-api-key [nombre-proveedor]"
  );
}

if (require.main === module) {
  checkApiKeys();
}

module.exports = { checkApiKeys, loadEnvFile };
