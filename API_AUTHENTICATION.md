# 🔐 Sistema de Autenticación de APIs - Plum Viajes

Este documento explica cómo configurar y gestionar API keys para proveedores externos que deseen consumir las APIs de Plum Viajes.

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Tipos de Autenticación](#tipos-de-autenticación)
- [Configuración de API Keys](#configuración-de-api-keys)
- [Cómo Generar una Nueva API Key](#cómo-generar-una-nueva-api-key)
- [Uso para Proveedores Externos](#uso-para-proveedores-externos)
- [Ejemplos de Implementación](#ejemplos-de-implementación)
- [Monitoreo y Seguridad](#monitoreo-y-seguridad)
- [Troubleshooting](#troubleshooting)

## 🎯 Descripción General

El sistema de autenticación de Plum Viajes permite tres tipos de acceso:

1. **🏠 Acceso Interno**: Para el propio proyecto y componentes internos
2. **🤝 Acceso Externo**: Para proveedores y partners externos
3. **🌐 Acceso Público**: Para endpoints específicos sin autenticación

## 🔑 Tipos de Autenticación

### 1. Acceso Interno

- **Quién**: Componentes del propio sistema (frontend, Sanity Studio, etc.)
- **Cómo**: Detección automática por origen o API keys internas
- **Rate Limit**: 1000 requests/minuto

### 2. Acceso Externo

- **Quién**: Proveedores, partners, servicios externos
- **Cómo**: API key en header `Authorization` o `X-API-Key`
- **Rate Limit**: 100 requests/minuto

### 3. Acceso Público

- **Quién**: Endpoints públicos específicos
- **Cómo**: Sin autenticación
- **Rate Limit**: 10 requests/minuto

## ⚙️ Configuración de API Keys

Las API keys se configuran en el archivo `.env` usando el siguiente formato:

```bash
# API Keys Internas (ya configuradas)
NEXT_PUBLIC_API_KEY=pk_4770bb19d7f298fd312bc1bdc97ec39a8fdfc130304235ab88e6a345809728be2
SANITY_STUDIO_NEXT_API_KEY=sanity_4640354b374a3418a65b4fe2bd50c8630fc9e36402cce2f921356b77c50c4c28

# API Keys Externas (para proveedores)
EXTERNAL_API_KEY_[NOMBRE_PROVEEDOR]=valor_de_la_clave
```

### Ejemplos de Configuración:

```bash
# Para un proveedor específico
EXTERNAL_API_KEY_BOOKING_PARTNER=sk_booking_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Para un partner comercial
EXTERNAL_API_KEY_TRAVEL_AGENCY_ABC=sk_agency_9876543210fedcba1234567890abcdef

# Para un servicio de integración
EXTERNAL_API_KEY_INTEGRATION_SERVICE=sk_integration_abcdef1234567890fedcba0987654321
```

## 🚀 Cómo Generar una Nueva API Key

### Paso 1: Generar la API Key

**Opción A: Usando Node.js (Recomendado)**

```bash
# Generar una API key segura con prefijo
node -e "console.log('sk_' + require('crypto').randomBytes(32).toString('hex'))"
```

**Opción B: Usando comando**

```bash
# Generar UUID
node -e "console.log('sk_' + require('crypto').randomUUID().replace(/-/g, ''))"
```

**Ejemplo de salida:**

```
sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6
```

### Paso 2: Agregar al archivo .env

1. Abre el archivo `.env` en la raíz del proyecto
2. Agrega la nueva variable siguiendo el formato:

```bash
# Nuevo proveedor: TravelCorp
EXTERNAL_API_KEY_TRAVELCORP=sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6
```

### Paso 3: Reiniciar el Servidor

```bash
# Detener el servidor y reiniciar
npm run dev
# o
yarn dev
```

### Paso 4: Verificar la Configuración

Puedes verificar que la API key fue configurada correctamente accediendo (internamente) a:

```
GET /api/auth/status
```

## 👥 Uso para Proveedores Externos

### Headers de Autenticación

Los proveedores externos pueden usar cualquiera de estos formatos:

**Opción 1: Authorization Bearer (Recomendado)**

```javascript
fetch("https://plumviajes.com.ar/api/packages", {
  headers: {
    Authorization:
      "Bearer sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6",
    "Content-Type": "application/json",
  },
});
```

**Opción 2: X-API-Key Header**

```javascript
fetch("https://plumviajes.com.ar/api/packages", {
  headers: {
    "X-API-Key":
      "sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6",
    "Content-Type": "application/json",
  },
});
```

### Endpoints Disponibles

| Endpoint                     | Método | Descripción              | Autenticación |
| ---------------------------- | ------ | ------------------------ | ------------- |
| `/api/packages`              | GET    | Listar paquetes          | Requerida     |
| `/api/packages/availability` | POST   | Consultar disponibilidad | Requerida     |
| `/api/packages/detail`       | POST   | Detalle de paquete       | Requerida     |
| `/api/hotels`                | GET    | Listar hoteles           | Requerida     |
| `/api/cities`                | GET    | Listar ciudades          | Requerida     |
| `/api/airlines`              | GET    | Listar aerolíneas        | Requerida     |

## 💻 Ejemplos de Implementación

### JavaScript/Node.js

```javascript
const PLUM_API_KEY =
  "sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6";
const BASE_URL = "https://plumviajes.com.ar/api";

async function getPackages() {
  try {
    const response = await fetch(`${BASE_URL}/packages`, {
      headers: {
        Authorization: `Bearer ${PLUM_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error;
  }
}

async function checkAvailability(searchParams) {
  try {
    const response = await fetch(`${BASE_URL}/packages/availability`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PLUM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchParams),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking availability:", error);
    throw error;
  }
}
```

### Python

```python
import requests
import json

PLUM_API_KEY = 'sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6'
BASE_URL = 'https://plumviajes.com.ar/api'

def get_packages():
    headers = {
        'Authorization': f'Bearer {PLUM_API_KEY}',
        'Content-Type': 'application/json'
    }

    response = requests.get(f'{BASE_URL}/packages', headers=headers)
    response.raise_for_status()
    return response.json()

def check_availability(search_params):
    headers = {
        'Authorization': f'Bearer {PLUM_API_KEY}',
        'Content-Type': 'application/json'
    }

    response = requests.post(
        f'{BASE_URL}/packages/availability',
        headers=headers,
        json=search_params
    )
    response.raise_for_status()
    return response.json()
```

### cURL

```bash
# Obtener paquetes
curl -X GET "https://plumviajes.com.ar/api/packages" \
  -H "Authorization: Bearer sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6" \
  -H "Content-Type: application/json"

# Consultar disponibilidad
curl -X POST "https://plumviajes.com.ar/api/packages/availability" \
  -H "Authorization: Bearer sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6" \
  -H "Content-Type: application/json" \
  -d '{
    "departureCity": "BUE",
    "arrivalCity": "MIA",
    "startDate": "2025-12-01",
    "endDate": "2025-12-15",
    "occupancy": "2|0"
  }'
```

## 🔍 Monitoreo y Seguridad

### Endpoint de Estado (Solo Interno)

```
GET /api/auth/status
```

Retorna información sobre:

- Estado de configuración
- Estadísticas de API keys
- Proveedores configurados
- Rate limits actuales

### Rate Limits por Tipo

- **Interno**: 1000 requests/minuto
- **Externo**: 100 requests/minuto
- **Público**: 10 requests/minuto

### Logs de Seguridad

El sistema automáticamente registra:

- Intentos de autenticación fallidos
- Uso excesivo de rate limits
- API keys inválidas o expiradas

### Buenas Prácticas

1. **🔐 Mantén las API keys seguras**: No las incluyas en código público
2. **🔄 Rota las API keys regularmente**: Especialmente si sospechas compromiso
3. **📊 Monitorea el uso**: Revisa logs regularmente
4. **⚡ Respeta los rate limits**: Implementa retry logic con backoff
5. **🛡️ Usa HTTPS siempre**: Para todas las llamadas a la API

## 🚨 Troubleshooting

### Error 401: Unauthorized

```json
{
  "error": true,
  "message": "Authentication failed",
  "code": "AUTH_FAILED"
}
```

**Solución**: Verifica que la API key sea correcta y esté en el header correcto.

### Error 429: Too Many Requests

```json
{
  "error": "Too many requests"
}
```

**Solución**: Has excedido el rate limit. Espera antes de hacer más requests.

### Error 403: CORS Error

```json
{
  "error": "CORS Error: Origin not allowed"
}
```

**Solución**: Contacta al equipo de Plum Viajes para agregar tu dominio a la lista de orígenes permitidos.

### API Key no funciona después de crearla

1. Verifica que el formato sea correcto: `EXTERNAL_API_KEY_[NOMBRE]=valor`
2. Reinicia el servidor después de agregar la variable
3. Verifica que no haya espacios o caracteres especiales en el nombre del proveedor

## 📞 Soporte

Para solicitar una nueva API key o reportar problemas:

1. **Email**: [email de soporte]
2. **Documentación técnica**: Este documento
3. **Status page**: `/api/auth/status` (solo acceso interno)

## 📝 Changelog

### 2025-07-02

- ✅ Documentación inicial del sistema de autenticación
- ✅ Ejemplos de implementación en múltiples lenguajes
- ✅ Guía completa de configuración y troubleshooting

---

**¿Necesitas ayuda?** Contacta al equipo de desarrollo de Plum Viajes.
