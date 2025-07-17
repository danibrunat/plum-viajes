import crypto from "crypto";

/**
 * Servicio para generar claves de cache consistentes y reutilizables
 */
const CacheKeysService = {
  /**
   * Genera una clave de cache para disponibilidad de paquetes
   * @param {Object} searchParams - Parámetros de búsqueda
   * @param {Object} selectedFilters - Filtros seleccionados
   * @returns {string} Clave de cache
   */
  packages: {
    availability: (searchParams, selectedFilters = {}) => {
      const normalizedParams = {
        ...searchParams,
        // Ordenar las claves para consistencia
        ...Object.keys(selectedFilters)
          .sort()
          .reduce((acc, key) => {
            acc[key] = Array.isArray(selectedFilters[key])
              ? selectedFilters[key].sort()
              : selectedFilters[key];
            return acc;
          }, {}),
      };

      const stringified = JSON.stringify(normalizedParams);
      const hash = crypto.createHash("md5").update(stringified).digest("hex");

      return `pkg:avail:${hash}`;
    },

    detail: (provider, id, searchParams) => {
      const normalizedParams = { provider, id, ...searchParams };
      const stringified = JSON.stringify(normalizedParams);
      const hash = crypto.createHash("md5").update(stringified).digest("hex");

      return `pkg:detail:${hash}`;
    },

    /**
     * Genera patrones para invalidar cache relacionado con un paquete
     * Invalida todas las búsquedas que podrían contener este paquete
     * @param {Object} packageData - Datos del paquete desde Sanity
     * @returns {Array<string>} Array de patrones de claves para invalidar
     */
    getInvalidationPatterns: (packageData) => {
      const patterns = [];

      // Extraer datos relevantes del paquete
      const {
        destination,
        origin,
        departures = [],
        _id,
        provider = "plum",
      } = packageData;

      console.log("📝 Generando patrones de invalidación para:", {
        destination,
        origin,
        departuresCount: departures.length,
        packageId: _id,
      });

      // 1. Invalidar cache de departures específicas del paquete
      if (_id) {
        patterns.push(_id.replace("drafts.", "")); // Clave directa del paquete
      }

      // 2. INVALIDACIÓN PRINCIPAL: Todas las búsquedas de availability
      // que podrían incluir este paquete basado en destino/origen
      if (destination?.current || origin?.current) {
        console.log(
          "🎯 Invalidando búsquedas que incluyan destino/origen del paquete"
        );

        // Invalidar TODAS las búsquedas de availability
        // Esto garantiza que cualquier búsqueda que haya incluido este paquete
        // se regenere completamente con los datos actualizados
        patterns.push("pkg:avail:*");

        // También invalidar búsquedas específicas por destino si tenemos la info
        if (destination?.current) {
          console.log(
            `📍 Invalidando búsquedas a destino: ${destination.current}`
          );
        }
        if (origin?.current) {
          console.log(
            `📍 Invalidando búsquedas desde origen: ${origin.current}`
          );
        }
      }

      // 3. Invalidar detalles específicos del paquete
      if (_id && provider) {
        patterns.push(`pkg:detail:*${provider}*`);
        patterns.push(`pkg:detail:*${_id.replace("drafts.", "")}*`);
      }

      // 4. Invalidación temporal: búsquedas en el rango de fechas del paquete
      if (departures.length > 0) {
        console.log("📅 Invalidando búsquedas en rangos de fechas del paquete");

        // Obtener rango de fechas del paquete
        const dates = departures
          .map((d) => d.departureFrom)
          .filter(Boolean)
          .sort();

        if (dates.length > 0) {
          const minDate = dates[0];
          const maxDate = dates[dates.length - 1];

          console.log(
            `📅 Rango de fechas del paquete: ${minDate} a ${maxDate}`
          );

          // Por simplicidad, invalidamos todas las availability
          // En el futuro se podría implementar invalidación más granular por fechas
          patterns.push("pkg:avail:*");
        }
      }

      // Remover duplicados
      const uniquePatterns = [...new Set(patterns)];
      console.log("🎯 Patrones finales generados:", uniquePatterns);

      return uniquePatterns;
    },
  },

  /**
   * Genera claves para cache de ciudades
   */
  cities: {
    byCode: (code) => `city:code:${code}`,
    autocomplete: (query) => `city:autocomplete:${query.toLowerCase()}`,
  },

  /**
   * Genera claves para cache de hoteles
   */
  hotels: {
    byId: (id) => `hotel:id:${id}`,
    byName: (name) => `hotel:name:${name.toLowerCase()}`,
  },

  /**
   * Genera claves para cache de aerolíneas
   */
  airlines: {
    byCode: (code) => `airline:code:${code}`,
    all: () => `airlines:all`,
  },
};

export default CacheKeysService;
