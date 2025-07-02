# Sistema de Autenticación API

Este documento describe cómo configurar y usar el sistema de autenticación para APIs externas en el proyecto Plum Viajes.

## Configuración de Environment Variables

### API Keys Internas (ya existentes)

```env
NEXT_PUBLIC_API_KEY=your-internal-api-key
SANITY_STUDIO_NEXT_API_KEY=your-sanity-api-key
```

### API Keys Externas (nuevas)

Para añadir API keys para proveedores externos, usar el formato:

```env
EXTERNAL_API_KEY_PROVIDER1=sk_provider1_api_key_here
EXTERNAL_API_KEY_PROVIDER2=sk_provider2_api_key_here
EXTERNAL_API_KEY_PARTNER_ABC=sk_partner_abc_key_here
```

**Formato:**

- Prefijo: `EXTERNAL_API_KEY_`
- Nombre del proveedor: `PROVIDER_NAME` (será convertido a lowercase)
- Valor: La API key actual

## Tipos de Autenticación

### 1. Acceso Interno

- **Origen:** Mismo dominio/aplicación
- **Método:** Detección automática por origen o API keys internas
- **Uso:** Para llamadas internas entre componentes del sistema

### 2. Acceso Externo

- **Origen:** Proveedores externos
- **Método:** API key en header `Authorization: Bearer <key>` o `X-API-Key: <key>`
- **Uso:** Para proveedores que consumen nuestras APIs

### 3. Acceso Público

- **Origen:** Cualquiera
- **Método:** Sin autenticación
- **Uso:** Para endpoints públicos específicos

## Uso en API Routes

### Proteger una ruta (por defecto)

```javascript
import { auth } from "../../lib/auth/index.js";

async function handler(request, context) {
  const authInfo = auth.getAuthInfo(context);
  // Tu lógica aquí
  return Response.json({ message: "Success" });
}

export const GET = auth.protect(handler);
```

### Ruta pública (sin autenticación)

```javascript
import { auth } from "../../lib/auth/index.js";

async function handler(request) {
  return Response.json({ message: "Public endpoint" });
}

export const GET = auth.public(handler);
```

### Ruta solo interna

```javascript
import { auth } from "../../lib/auth/index.js";

async function handler(request, context) {
  return Response.json({ message: "Internal only" });
}

export const GET = auth.internal(handler);
```

### Ruta solo externa

```javascript
import { auth } from "../../lib/auth/index.js";

async function handler(request, context) {
  const provider = auth.getProvider(context);
  return Response.json({
    message: "External only",
    provider,
  });
}

export const GET = auth.external(handler);
```

## Información de Autenticación en Context

```javascript
const authInfo = auth.getAuthInfo(context);
console.log(authInfo);
// {
//   type: 'external', // 'internal', 'external', 'public'
//   provider: 'provider1', // nombre del proveedor
//   keyData: { /* información adicional */ }
// }

// Helpers útiles
const isInternal = auth.isInternal(context);
const isExternal = auth.isExternal(context);
const provider = auth.getProvider(context);
```

## Headers de Autenticación

### Para proveedores externos:

```bash
# Opción 1: Bearer token
Authorization: Bearer sk_provider1_api_key_here

# Opción 2: X-API-Key header
X-API-Key: sk_provider1_api_key_here
```

## Monitoreo

### Endpoint de estado del sistema

```
GET /api/auth/status
```

Solo accesible internamente. Retorna:

- Estado de configuración
- Estadísticas de API keys
- Proveedores configurados
- Errores y advertencias

## Rate Limits

Por defecto:

- **Interno:** 1000 requests/minuto
- **Externo:** 100 requests/minuto
- **Público:** 10 requests/minuto

## Configuración Avanzada

### Rutas públicas por defecto

```javascript
// En app/lib/auth/config.js
publicRoutes: ["/api/health", "/api/status"];
```

### Rutas solo internas

```javascript
internalOnlyRoutes: ["/api/admin", "/api/internal"];
```

### Rutas solo externas

```javascript
externalRoutes: ["/api/external", "/api/webhook"];
```

## Ejemplos de Uso

### Consumir APIs desde un proveedor externo

```javascript
const response = await fetch("https://your-domain.com/api/packages", {
  headers: {
    Authorization: "Bearer sk_provider1_api_key_here",
    "Content-Type": "application/json",
  },
});
```

### Consumir APIs internamente (desde el propio proyecto)

```javascript
// No requiere autenticación adicional si es desde el mismo origen
const response = await fetch("/api/packages");
```

## Seguridad

- Las API keys externas se configuran via environment variables
- No se almacenan en base de datos
- Rate limiting automático por tipo de acceso
- Logs de intentos fallidos
- Validación de origen para acceso interno

## Migración desde el sistema anterior

El sistema es **completamente compatible** con el código existente:

- Las API keys actuales (`NEXT_PUBLIC_API_KEY`, `SANITY_STUDIO_NEXT_API_KEY`) siguen funcionando
- El middleware existente ha sido actualizado para usar el nuevo sistema
- No se requieren cambios en las rutas existentes
