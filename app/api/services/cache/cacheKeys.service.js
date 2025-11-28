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
      // Incluimos el pkgId en la clave para poder invalidar por paquete específico
      const normalizedParams = { provider, ...searchParams };
      const stringified = JSON.stringify(normalizedParams);
      const hash = crypto.createHash("md5").update(stringified).digest("hex");

      // Formato: pkg:detail:{pkgId}:{hash} - permite invalidar con patrón pkg:detail:{pkgId}:*
      return `pkg:detail:${id}:${hash}`;
    },

    /**
     * Genera el patrón para invalidar cache de detail de un paquete específico
     * @param {string} pkgId - ID del paquete (sin prefijo "drafts.")
     * @returns {string} Patrón de clave para invalidar
     */
    detailInvalidationPattern: (pkgId) => {
      const cleanId = pkgId.replace("drafts.", "");
      return `pkg:detail:${cleanId}:*`;
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

      // Procesar origen: puede ser array de strings o un objeto con current
      let originCodes = [];
      if (Array.isArray(origin)) {
        originCodes = origin;
      } else if (origin?.current) {
        originCodes = [origin.current];
      }

      // Procesar destino: puede ser array de references o un objeto con current
      let destinationCodes = [];
      if (Array.isArray(destination)) {
        // Por ahora, si son references, invalidamos todo
        // TODO: resolver references para obtener códigos específicos
        destinationCodes = ["ANY_DESTINATION"]; // Marcador para invalidar todo
      } else if (destination?.current) {
        destinationCodes = [destination.current];
      }

      console.log("📝 Generando patrones de invalidación para:", {
        packageId: _id,
        originCodes,
        destinationCodes,
        departuresCount: departures.length,
      });

      // 1. Invalidar cache de departures específicas del paquete
      if (_id) {
        patterns.push(_id.replace("drafts.", "")); // Clave directa del paquete
      }

      // 2. INVALIDACIÓN PRINCIPAL: Todas las búsquedas de availability
      // que podrían incluir este paquete basado en destino/origen
      if (originCodes.length > 0 || destinationCodes.length > 0) {
        console.log(
          "🎯 Invalidando búsquedas que incluyan destino/origen del paquete"
        );

        // Invalidar TODAS las búsquedas de availability
        // Esto garantiza que cualquier búsqueda que haya incluido este paquete
        // se regenere completamente con los datos actualizados
        patterns.push("pkg:avail:*");

        // Log de información específica
        if (originCodes.length > 0) {
          console.log(
            `📍 Invalidando búsquedas desde orígenes: ${originCodes.join(", ")}`
          );
        }
        if (destinationCodes.length > 0) {
          console.log(
            `🎯 Invalidando búsquedas a destinos: ${destinationCodes.join(", ")}`
          );
        }
      }

      // 3. Invalidar detalles específicos del paquete usando el método helper
      if (_id) {
        patterns.push(CacheKeysService.packages.detailInvalidationPattern(_id));
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
