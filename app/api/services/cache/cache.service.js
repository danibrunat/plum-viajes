import RedisService from "../redis.service";
import CacheKeysService from "./cacheKeys.service";
import CACHE_POLICIES, { getTTL } from "../../../constants/cachePolicies";

/**
 * Servicio simplificado para manejo de cache con políticas centralizadas
 */
const CacheService = {
  /**
   * Cache para disponibilidad de paquetes
   */
  packages: {
    /**
     * Obtiene datos desde cache
     * @param {Object} searchParams - Parámetros de búsqueda
     * @param {Object} selectedFilters - Filtros seleccionados
     * @returns {Promise<Object|null>} Datos cacheados o null si no existen
     */
    getAvailabilityFromCache: async (searchParams, selectedFilters) => {
      const cacheKey = CacheKeysService.packages.availability(
        searchParams,
        selectedFilters
      );
      return await RedisService.get(cacheKey);
    },

    /**
     * Guarda datos en cache usando políticas centralizadas
     * @param {Object} searchParams - Parámetros de búsqueda
     * @param {Object} selectedFilters - Filtros seleccionados
     * @param {Object} data - Datos a guardar
     * @param {string} customTTL - TTL personalizado (opcional)
     */
    setAvailabilityCache: async (
      searchParams,
      selectedFilters,
      data,
      customTTL = null
    ) => {
      const cacheKey = CacheKeysService.packages.availability(
        searchParams,
        selectedFilters
      );
      const ttl = customTTL || getTTL("PACKAGES_AVAILABILITY");
      await RedisService.set(cacheKey, data, ttl);
    },

    /**
     * Obtiene detalle desde cache
     * @param {string} provider - Proveedor
     * @param {string} id - ID del paquete
     * @param {Object} searchParams - Parámetros de búsqueda
     * @returns {Promise<Object|null>} Datos cacheados o null si no existen
     */
    getDetailFromCache: async (provider, id, searchParams) => {
      const cacheKey = CacheKeysService.packages.detail(
        provider,
        id,
        searchParams
      );
      return await RedisService.get(cacheKey);
    },

    /**
     * Guarda detalle en cache usando políticas centralizadas
     * @param {string} provider - Proveedor
     * @param {string} id - ID del paquete
     * @param {Object} searchParams - Parámetros de búsqueda
     * @param {Object} data - Datos a guardar
     * @param {string} customTTL - TTL personalizado (opcional)
     */
    setDetailCache: async (
      provider,
      id,
      searchParams,
      data,
      customTTL = null
    ) => {
      const cacheKey = CacheKeysService.packages.detail(
        provider,
        id,
        searchParams
      );
      const ttl = customTTL || getTTL("PACKAGES_DETAIL");
      console.log(`Guardando en cache: ${cacheKey} (TTL: ${ttl}s)`);
      await RedisService.set(cacheKey, data, ttl);
    },

    /**
     * Guarda departures en cache usando políticas centralizadas
     * @param {Array} pkgDepartures - Array de departures
     * @param {boolean} longTerm - Si usar TTL largo (para casos especiales)
     */
    setDeparturesCache: async (pkgDepartures, longTerm = false) => {
      const ttlType = longTerm
        ? "PACKAGES_DEPARTURES_LONG"
        : "PACKAGES_DEPARTURES";
      const ttl = getTTL(ttlType);

      const pipelineItems = pkgDepartures.map((pkg) => ({
        key: pkg.pkgId,
        value: pkg.departures,
        expireInSeconds: ttl,
      }));

      console.log(
        `Guardando ${pkgDepartures.length} departures en cache (TTL: ${ttl}s)`
      );
      await RedisService.pipelineSet(pipelineItems);
    },

    /**
     * Invalida cache de disponibilidad
     */
    invalidateAvailability: async (searchParams, selectedFilters) => {
      const cacheKey = CacheKeysService.packages.availability(
        searchParams,
        selectedFilters
      );
      await RedisService.delete(cacheKey);
    },
  },
  /**
   * Cache para ciudades
   */
  cities: {
    getFromCache: async (code) => {
      const cacheKey = CacheKeysService.cities.byCode(code);
      return await RedisService.get(cacheKey);
    },

    setCache: async (code, data, customTTL = null) => {
      const cacheKey = CacheKeysService.cities.byCode(code);
      const ttl = customTTL || getTTL("CITIES");
      console.log(`Guardando ciudad en cache: ${cacheKey} (TTL: ${ttl}s)`);
      await RedisService.set(cacheKey, data, ttl);
    },

    setAutocompleteCache: async (query, data, customTTL = null) => {
      const cacheKey = CacheKeysService.cities.autocomplete(query);
      const ttl = customTTL || getTTL("CITIES_AUTOCOMPLETE");
      await RedisService.set(cacheKey, data, ttl);
    },
  },

  /**
   * Cache para hoteles
   */
  hotels: {
    setCache: async (identifier, data, type = "byId", customTTL = null) => {
      const cacheKey =
        type === "byId"
          ? CacheKeysService.hotels.byId(identifier)
          : CacheKeysService.hotels.byName(identifier);
      const ttl = customTTL || getTTL("HOTELS");
      await RedisService.set(cacheKey, data, ttl);
    },
  },

  /**
   * Cache para aerolíneas
   */
  airlines: {
    setCache: async (code, data, customTTL = null) => {
      const cacheKey = CacheKeysService.airlines.byCode(code);
      const ttl = customTTL || getTTL("AIRLINES");
      await RedisService.set(cacheKey, data, ttl);
    },

    setAllCache: async (data, customTTL = null) => {
      const cacheKey = CacheKeysService.airlines.all();
      const ttl = customTTL || getTTL("AIRLINES");
      await RedisService.set(cacheKey, data, ttl);
    },
  },

  /**
   * Utilidades generales
   */
  utils: {
    /**
     * Limpia cache por patrón usando las políticas definidas
     */
    clearByPattern: async (patternKey) => {
      const pattern = CACHE_POLICIES.KEY_PATTERNS[patternKey];
      if (!pattern) {
        console.warn(`Pattern "${patternKey}" not found in cache policies`);
        return;
      }
      console.log(`Limpiando cache con patrón: ${pattern}`);
      // Implementar lógica para limpiar cache por patrón
    },

    /**
     * Obtiene TTL actual para un tipo de cache
     */
    getTTLForType: (cacheType) => getTTL(cacheType),

    /**
     * Estadísticas de cache por tipo
     */
    getStatsByType: async (cacheType) => {
      // Implementar lógica para obtener estadísticas específicas
      return {
        type: cacheType,
        ttl: getTTL(cacheType),
        environment: process.env.NODE_ENV,
      };
    },
  },
};

export default CacheService;
