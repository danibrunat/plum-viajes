/**
 * Políticas centralizadas de cache para toda la aplicación
 * Todos los TTLs están en segundos
 */
const CACHE_POLICIES = {
  /**
   * TTL para diferentes tipos de datos (todos en decisegundos para Upstash Redis)
   */
  TTL: {
    // Disponibilidad de paquetes (datos que cambian frecuentemente)
    PACKAGES_AVAILABILITY: 18000, // 30 minutos

    // Detalles de paquetes (menos volátiles)
    PACKAGES_DETAIL: 36000, // 1 hora

    // Departures (datos específicos de salidas)
    PACKAGES_DEPARTURES: 864000, // 24 horas
    PACKAGES_DEPARTURES_LONG: 1000000000, // 1157 días (para casos especiales)

    // Datos de ciudades (muy estables)
    CITIES: 864000, // 24 horas
    CITIES_AUTOCOMPLETE: 432000, // 12 horas

    // Datos de hoteles (relativamente estables)
    HOTELS: 432000, // 12 horas

    // Datos de aerolíneas (muy estables)
    AIRLINES: 6048000, // 7 días

    // Cache de sesiones y tokens
    AUTH_TOKENS: 9000, // 15 minutos

    // Filtros dinámicos
    DYNAMIC_FILTERS: 18000, // 30 minutos
  },

  /**
   * Configuración de revalidación para Next.js
   */
  REVALIDATION: {
    ola: {
      avail: 10000,
      detail: 14400, // 4 horas
    },
    cities: 60000,
    packages: {
      availability: 1800, // 30 minutos
      detail: 3600, // 1 hora
    },
  },

  /**
   * Configuración de rate limiting por tipo de cache
   */
  RATE_LIMITS: {
    packages: {
      maxRequestsPerMinute: 100,
      burstLimit: 20,
    },
    cities: {
      maxRequestsPerMinute: 200,
      burstLimit: 50,
    },
  },

  /**
   * Patrones de claves para limpieza masiva
   */
  KEY_PATTERNS: {
    ALL_PACKAGES: "pkg:*",
    ALL_CITIES: "city:*",
    ALL_HOTELS: "hotel:*",
    ALL_AIRLINES: "airline:*",
    AVAILABILITY_ONLY: "pkg:avail:*",
    DETAIL_ONLY: "pkg:detail:*",
  },

  /**
   * Configuración de entornos
   */
  ENV_CONFIG: {
    development: {
      // En desarrollo, cache más corto para ver cambios rápido
      multiplier: 0.1, // 10% del tiempo normal
    },
    production: {
      multiplier: 1, // Tiempo completo
    },
    staging: {
      multiplier: 0.5, // 50% del tiempo normal
    },
  },
};

/**
 * Obtiene el TTL ajustado según el entorno
 * @param {string} cacheType - Tipo de cache (ej: 'PACKAGES_AVAILABILITY')
 * @param {string} env - Entorno actual (development, production, staging)
 * @returns {number} TTL en segundos
 */
export const getTTL = (
  cacheType,
  env = process.env.NODE_ENV || "production"
) => {
  const baseTTL = CACHE_POLICIES.TTL[cacheType];
  if (!baseTTL) {
    console.warn(`Cache type "${cacheType}" not found, using default 1 hour`);
    return 3600;
  }

  const envConfig =
    CACHE_POLICIES.ENV_CONFIG[env] || CACHE_POLICIES.ENV_CONFIG.production;
  return Math.floor(baseTTL * envConfig.multiplier);
};

/**
 * Obtiene configuración de revalidación para Next.js
 * @param {string} provider - Proveedor (ola, plum, etc.)
 * @param {string} type - Tipo de datos (avail, detail, etc.)
 * @returns {number} Tiempo de revalidación
 */
export const getRevalidation = (provider, type) => {
  return (
    CACHE_POLICIES.REVALIDATION[provider]?.[type] ||
    CACHE_POLICIES.REVALIDATION.packages[type] ||
    3600
  );
};

export default CACHE_POLICIES;
