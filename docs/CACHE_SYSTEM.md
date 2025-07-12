# Sistema de Cache - Plum Viajes

## 🎯 Visión General

El sistema de cache de Plum Viajes está diseñado para ser **centralizado**, **configurable** y **fácil de apagar**. Utiliza Upstash Redis con TTLs configurables y controles granulares para optimizar el rendimiento mientras mantiene la flexibilidad operacional.

### ✨ Características Principales

- 🎛️ **Control Global**: Apaga todo el cache con una variable de entorno
- 🔧 **Control Granular**: Habilita/deshabilita cache por módulos específicos
- ⏱️ **TTLs Centralizados**: Todos los tiempos de vida en un solo archivo
- 🚀 **Auto-validación**: Los servicios verifican automáticamente si el cache está habilitado
- 🔍 **Testing Integrado**: Ruta dedicada para probar el estado del cache

## 📋 Tabla de Contenidos

1. [Cómo Apagar el Cache](#-cómo-apagar-el-cache)
2. [Configuración de TTLs](#-configuración-de-ttls)
3. [Cómo Usar el Cache](#-cómo-usar-el-cache)
4. [Estructura del Sistema](#-estructura-del-sistema)
5. [Testing y Debugging](#-testing-y-debugging)
6. [Troubleshooting](#-troubleshooting)

## 🔧 Cómo Apagar el Cache

### ⚡ Apagar TODO el Cache (Recomendado para Debug)

**Opción 1: Variable de Entorno (Producción)**

```bash
# En tu archivo .env o variables de entorno del servidor
DISABLE_CACHE=true
```

**Opción 2: Configuración Directa (Desarrollo)**

```javascript
// En app/constants/cachePolicies.js línea ~13
const CACHE_ENABLED = false; // Cambia de true a false
```

### 🎯 Apagar Cache Por Módulos (Control Granular)

Para desactivar solo ciertos tipos de cache, modifica el objeto `CACHE_MODULES`:

```javascript
// En app/constants/cachePolicies.js línea ~20
const CACHE_MODULES = {
  PACKAGES: false, // ❌ Apagar cache de paquetes (availability, detail, departures)
  CITIES: true, // ✅ Mantener cache de ciudades y autocomplete
  HOTELS: true, // ✅ Mantener cache de hoteles
  AIRLINES: false, // ❌ Apagar cache de aerolíneas
  AUTH: true, // ✅ Mantener cache de tokens y autenticación
  FILTERS: true, // ✅ Mantener cache de filtros dinámicos
};
```

### 🔄 Aplicar Cambios

Después de modificar la configuración:

1. **Desarrollo**: Reinicia el servidor (`npm run dev`)
2. **Producción**: Redeploy o reinicia la aplicación
3. **Verificación**: Usa la ruta `/api/cache/test` para confirmar el estado

## ⏰ Configuración de TTLs

Todos los TTLs están en **segundos** y se definen en `app/constants/cachePolicies.js` dentro del objeto `CACHE_POLICIES.TTL`:

```javascript
const CACHE_POLICIES = {
  TTL: {
    // Paquetes y disponibilidad
    PACKAGES_AVAILABILITY: 1800, // 30 minutos - Búsquedas de paquetes
    PACKAGES_DETAIL: 3600, // 1 hora - Detalles de paquetes
    PACKAGES_DEPARTURES: 10800, // 3 horas - Fechas de salida
    PACKAGES_DEPARTURES_LONG: 86400, // 24 horas - Departures de larga duración

    // Ciudades y ubicaciones
    CITIES: 259200, // 3 días - Datos de ciudades
    CITIES_AUTOCOMPLETE: 86400, // 24 horas - Autocompletado

    // Hoteles
    HOTELS: 259200, // 3 días - Información de hoteles

    // Aerolíneas (muy estables)
    AIRLINES: 604800, // 7 días - Datos de aerolíneas

    // Autenticación y tokens
    AUTH_TOKENS: 900, // 15 minutos - Tokens de API

    // Filtros dinámicos
    DYNAMIC_FILTERS: 1800, // 30 minutos - Filtros de búsqueda
  },
};
```

### 🔧 Cómo Modificar TTLs

1. Ve a `app/constants/cachePolicies.js`
2. Localiza el objeto `CACHE_POLICIES.TTL`
3. Encuentra el TTL que quieres cambiar (ej: `PACKAGES_AVAILABILITY`)
4. Cambia el valor (en segundos)
5. Guarda el archivo y reinicia el servidor

**Tabla de Conversión de Tiempo:**

| Tiempo     | Segundos | Uso Recomendado      |
| ---------- | -------- | -------------------- |
| 5 minutos  | 300      | Datos muy dinámicos  |
| 15 minutos | 900      | Tokens, sesiones     |
| 30 minutos | 1800     | Búsquedas, filtros   |
| 1 hora     | 3600     | Autocompletado       |
| 3 horas    | 10800    | Datos semi-estáticos |
| 1 día      | 86400    | Datos estables       |
| 3 días     | 259200   | Datos muy estables   |
| 1 semana   | 604800   | Datos de referencia  |

## 🚀 Cómo Usar el Cache

### 📦 En tus Servicios (Automático)

El sistema funciona automáticamente. Solo usa los servicios normalmente:

```javascript
import CacheService from "../cache/cache.service";

// ✅ El servicio automáticamente verifica si el cache está habilitado
const cachedData = await CacheService.packages.getAvailabilityFromCache(
  searchParams,
  selectedFilters
);

if (cachedData) {
  console.log("📦 Datos desde cache");
  return cachedData;
}

// Obtener datos frescos desde la API
const freshData = await fetchFromProvider();

// Guardar en cache (solo si está habilitado)
await CacheService.packages.setAvailabilityCache(
  searchParams,
  selectedFilters,
  freshData
);

return freshData;
```

### 🔍 Verificación Manual (Opcional)

Si necesitas verificar el estado del cache manualmente:

````javascript
import {
  shouldCachePackages,
  shouldCacheCities,
Si necesitas verificar manualmente el estado del cache:

```javascript
import {
  shouldCachePackages,
  shouldCacheCities,
  isCacheEnabled,
} from "../constants/cachePolicies";

// Verificar cache por módulo
if (shouldCachePackages()) {
  console.log('✅ Cache de paquetes habilitado');
}

if (shouldCacheCities()) {
  console.log('✅ Cache de ciudades habilitado');
}

// Verificar cache global
if (isCacheEnabled()) {
  console.log('✅ Cache global habilitado');
} else {
  console.log('❌ Cache completamente deshabilitado');
}
````

## 📁 Estructura del Sistema

```
app/
├── constants/
│   └── cachePolicies.js          # ⚙️ Configuración central (TTLs, controles)
├── api/
│   ├── cache/
│   │   └── test/
│   │       └── route.js          # 🧪 Endpoint de testing
│   └── services/
│       ├── cache/
│       │   ├── cache.service.js  # 🔄 Servicio principal con auto-validación
│       │   └── cacheKeys.service.js # 🔑 Generación de claves
│       └── redis.service.js      # 🔗 Conexión Upstash Redis
├── docs/
│   └── CACHE_SYSTEM.md          # 📚 Esta documentación
└── ...
```

### 📄 Archivos Clave

| Archivo                        | Propósito                                        | Cuándo Modificar                            |
| ------------------------------ | ------------------------------------------------ | ------------------------------------------- |
| **`cachePolicies.js`**         | Configuración central de TTLs y controles        | Cambiar TTLs o habilitar/deshabilitar cache |
| **`cache.service.js`**         | Servicio principal con métodos por tipo de cache | Agregar nuevos tipos de cache               |
| **`redis.service.js`**         | Conexión y operaciones básicas con Upstash       | Cambiar configuración de Redis              |
| **`/api/cache/test/route.js`** | Endpoint para testing y debugging                | Testing y verificación                      |

## 🧪 Testing y Debugging

### 🔍 Endpoint de Testing

Usa la ruta dedicada para verificar el estado del cache:

```bash
# Verificar estado general del cache
GET /api/cache/test

# Probar cache de paquetes
GET /api/cache/test?action=test-packages

# Probar cache de ciudades
GET /api/cache/test?action=test-cities
```

**Respuesta de ejemplo:**

```json
{
  "success": true,
  "globalCacheEnabled": true,
  "modules": {
    "packages": true,
    "cities": true,
    "hotels": true,
    "airlines": true
  },
  "environment": {
    "NODE_ENV": "development",
    "DISABLE_CACHE": null
  }
}
```

### 🐛 Debugging en Código

```javascript
// Verificar en tiempo real
import {
  isCacheEnabled,
  shouldCachePackages,
} from "../constants/cachePolicies";

console.log("🔍 Cache Debug Info:");
console.log("Global enabled:", isCacheEnabled());
console.log("Packages enabled:", shouldCachePackages());
console.log("Environment DISABLE_CACHE:", process.env.DISABLE_CACHE);
```

## 🔧 Troubleshooting

### ❌ El Cache No Se Apaga

1. **Verifica las variables de entorno**

   ```bash
   # En desarrollo
   echo $DISABLE_CACHE

   # En producción (dependiendo del hosting)
   printenv | grep DISABLE_CACHE
   ```

2. **Verifica la configuración en código**

   ```javascript
   // Agrega esto temporalmente en cachePolicies.js
   console.log("🔍 CACHE_ENABLED:", CACHE_ENABLED);
   console.log("🔍 DISABLE_CACHE env:", process.env.DISABLE_CACHE);
   ```

3. **Usa el endpoint de testing**

   ```bash
   curl /api/cache/test
   # O visita la URL en el navegador
   ```

4. **Reinicia completamente el servidor**

   ```bash
   # Desarrollo
   npm run dev

   # Producción
   # Redeploy o restart según tu hosting
   ```

### ⏱️ Los TTLs No Se Respetan

1. **Verifica que uses segundos, no milisegundos**

   ```javascript
   // ❌ Incorrecto (milisegundos)
   PACKAGES_AVAILABILITY: 300000, // 5 minutos en milisegundos

   // ✅ Correcto (segundos)
   PACKAGES_AVAILABILITY: 300,    // 5 minutos en segundos
   ```

2. **Verifica la configuración de Upstash Redis**
   - Upstash Redis espera TTLs en segundos
   - Revisa la configuración en `redis.service.js`
   - Confirma que usas `EX` no `PX` en los comandos SET

3. **Verifica en Upstash Console**
   - Ve al dashboard de Upstash
   - Revisa las claves y sus TTLs
   - Usa el comando `TTL key_name` para verificar

### 🔄 Cache Inconsistente o Datos Viejos

1. **Limpia el cache manualmente**

   ```bash
   # En Upstash Console o Redis CLI
   FLUSHDB

   # O por patrón específico
   DEL pkg:*
   DEL city:*
   ```

2. **Verifica las claves de cache**

   ```javascript
   // En tu código de debugging
   console.log("🔑 Cache key generada:", cacheKey);
   ```

3. **Revisa los logs del servidor**
   ```bash
   # Busca mensajes como:
   # "Guardando en cache: pkg:avail:..."
   # "Cache hit/miss para: ..."
   ```

### 🚨 Errores de Conexión Redis

1. **Verifica las credenciales de Upstash**

   ```javascript
   // En redis.service.js o variables de entorno
   console.log("Redis URL configured:", !!process.env.UPSTASH_REDIS_REST_URL);
   ```

2. **Verifica la conectividad**

   ```bash
   # Usa el endpoint de test
   GET /api/cache/test?action=test-packages
   ```

3. **Revisa los logs de error**
   - Busca errores de timeout
   - Verifica límites de rate limiting de Upstash

## 📊 Monitoring y Métricas

### 📈 Métricas Importantes

- **Hit Rate**: % de solicitudes que vienen desde cache
- **Miss Rate**: % de solicitudes que requieren API calls
- **TTL Effectiveness**: Si los datos expiran en tiempo adecuado
- **Memory Usage**: Uso de memoria en Upstash

### 🔍 Cómo Monitorear

```javascript
// Agregar métricas en tu código
const cacheHit = await CacheService.packages.getAvailabilityFromCache(...);
if (cacheHit) {
  console.log('📊 CACHE HIT - Packages Availability');
} else {
  console.log('📊 CACHE MISS - Packages Availability');
}
```

## 🎯 Mejores Prácticas

### ✅ DO's

- **Usa los helpers**: Siempre usa `shouldCachePackages()` en lugar de verificar manualmente
- **TTLs apropiados**: Datos dinámicos = TTL corto, datos estáticos = TTL largo
- **Claves consistentes**: Usa `CacheKeysService` para generar claves consistentes
- **Logging**: Logea cache hits/misses para debugging
- **Testing**: Usa `/api/cache/test` para verificar configuración

### ❌ DON'Ts

- **No hardcodees TTLs**: Usa siempre `getTTL()`
- **No ignores errores**: Catch errores de Redis apropiadamente
- **No caches datos sensibles**: Evita cachear datos de usuarios específicos
- **No uses claves genéricas**: Evita colisiones con claves específicas

## 🚀 Quick Start Guide

### Para Desarrolladores Nuevos

1. **Entender el estado actual**

   ```bash
   # Visita esto en tu navegador
   http://localhost:3000/api/cache/test
   ```

2. **Apagar el cache para debugging**

   ```bash
   # Agrega esto a tu .env.local
   echo "DISABLE_CACHE=true" >> .env.local
   npm run dev
   ```

3. **Volver a habilitar el cache**
   ```bash
   # Remueve o comenta la línea en .env.local
   # DISABLE_CACHE=true
   npm run dev
   ```

### Para Configurar TTLs

1. Ve a `app/constants/cachePolicies.js`
2. Modifica los valores en `CACHE_POLICIES.TTL`
3. Reinicia el servidor
4. Verifica con `/api/cache/test`

## 📞 Soporte

### 🆘 Si Tienes Problemas

1. **Revisa los logs** del servidor para errores
2. **Usa el endpoint de testing** `/api/cache/test`
3. **Verifica las variables de entorno**
4. **Consulta esta documentación**

### 📝 Reportar Issues

Al reportar problemas con el cache, incluye:

- Estado actual del cache (`/api/cache/test`)
- Variables de entorno relacionadas
- Logs de error específicos
- Pasos para reproducir el problema

---

**Última actualización**: Julio 2025  
**Versión**: 2.0  
**Compatibilidad**: Next.js 13+, Upstash Redis
