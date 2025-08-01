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

    /**
     * Invalida cache por criterios de paquete (origen, destino, fechas)
     * Invalida TODAS las búsquedas que podrían contener este paquete
     * @param {Object} packageData - Datos del paquete desde Sanity
     */
    invalidateByPackageCriteria: async (packageData) => {
      try {
        console.log("🗑️ Invalidando cache por criterios de paquete...");

        // Procesar orígenes (array de strings)
        const origins = Array.isArray(packageData.origin)
          ? packageData.origin
          : packageData.origin?.current
            ? [packageData.origin.current]
            : [];

        // Procesar destinos (array de referencias o strings)
        let destinations = [];
        if (Array.isArray(packageData.destination)) {
          // Si son referencias, por ahora marcamos como "references"
          destinations =
            packageData.destination.length > 0 ? ["REFERENCES"] : [];
        } else if (packageData.destination?.current) {
          destinations = [packageData.destination.current];
        }

        console.log(
          "📦 Datos del paquete:",
          JSON.stringify(
            {
              id: packageData._id,
              title: packageData.title,
              origins,
              destinations,
              departuresCount: packageData.departures?.length || 0,
            },
            null,
            2
          )
        );

        const patterns =
          CacheKeysService.packages.getInvalidationPatterns(packageData);
        const deletedKeys = [];
        let totalSearchesInvalidated = 0;

        for (const pattern of patterns) {
          console.log(`🔍 Buscando claves con patrón: ${pattern}`);

          const keys = await RedisService.getKeysByPattern(pattern);

          if (keys && keys.length > 0) {
            console.log(`📋 Encontradas ${keys.length} claves para eliminar:`);

            // Separar por tipo de cache para mejor logging
            const availabilityKeys = keys.filter((key) =>
              key.includes("pkg:avail:")
            );
            const detailKeys = keys.filter((key) =>
              key.includes("pkg:detail:")
            );
            const departureKeys = keys.filter((key) => !key.includes(":"));

            if (availabilityKeys.length > 0) {
              console.log(
                `   🔍 ${availabilityKeys.length} búsquedas de availability`
              );
              totalSearchesInvalidated += availabilityKeys.length;
            }
            if (detailKeys.length > 0) {
              console.log(`   📄 ${detailKeys.length} detalles de paquetes`);
            }
            if (departureKeys.length > 0) {
              console.log(`   📅 ${departureKeys.length} caches de departures`);
            }

            await RedisService.deleteMultiple(keys);
            deletedKeys.push(...keys);
          } else {
            console.log(
              `   ℹ️ No se encontraron claves para el patrón: ${pattern}`
            );
          }
        }

        const summary = {
          success: true,
          deletedKeys: deletedKeys.length,
          searchesInvalidated: totalSearchesInvalidated,
          patterns: patterns,
          packageInfo: {
            id: packageData._id,
            title: packageData.title,
            origins,
            destinations,
          },
        };

        console.log(`✅ RESUMEN DE INVALIDACIÓN:`);
        console.log(`   🗑️ Total claves eliminadas: ${deletedKeys.length}`);
        console.log(`   🔍 Búsquedas invalidadas: ${totalSearchesInvalidated}`);
        console.log(`   📦 Paquete: ${packageData.title} (${packageData._id})`);
        console.log(`   📍 Orígenes: ${origins.join(", ") || "N/A"}`);
        console.log(`   🎯 Destinos: ${destinations.join(", ") || "N/A"}`);

        return summary;
      } catch (error) {
        console.error("❌ Error invalidando cache:", error);
        throw error;
      }
    },

    /**
     * Invalida cache de paquete específico
     * @param {string} packageId - ID del paquete
     */
    invalidatePackageById: async (packageId) => {
      try {
        console.log(`🗑️ Invalidando cache para paquete: ${packageId}`);

        // Invalidar departures específicas del paquete
        await RedisService.delete(packageId);

        // TODO: Invalidar availability y detail que contengan este paquete
        // Esto requeriría un patrón más sofisticado de tracking

        console.log(`✅ Cache de paquete ${packageId} invalidado`);
        return { success: true, packageId };
      } catch (error) {
        console.error("❌ Error invalidando cache de paquete:", error);
        throw error;
      }
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
