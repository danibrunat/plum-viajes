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
