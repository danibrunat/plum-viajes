const pcomService = {
  avail: {
    /**
     * Extrae un precio representativo para un paquete.
     * @param {Object} pkg - Un paquete con la propiedad departures.
     * @returns {number} El precio representativo (el mínimo basePrice).
     */
    getRepresentativePrice(pkg) {
      if (Array.isArray(pkg.departures) && pkg.departures.length > 0) {
        const prices = pkg.departures.map((dep) => {
          const price = dep?.prices?.pricesDetail?.basePrice;
          return Number(price) || Infinity;
        });
        return Math.min(...prices);
      }
      return Infinity;
    },

    /**
     * Ordena un array de paquetes por el basePrice sin modificar la estructura original.
     * @param {Array} packages - Array de paquetes.
     * @param {string} priceOrder - "high" para ordenar de mayor a menor, otro valor para menor a mayor.
     * @returns {Array} Un nuevo array ordenado.
     */
    sortPackagesByBasePrice(packages, priceOrder) {
      const isDescending = priceOrder === "high";
      return [...packages].sort((a, b) => {
        const priceA = this.getRepresentativePrice(a);
        const priceB = this.getRepresentativePrice(b);
        return isDescending ? priceB - priceA : priceA - priceB;
      });
    },

    /**
     * Recorre un objeto o array según un camino (path) y retorna un array con los valores encontrados.
     * @param {Object|Array} obj - Objeto o array actual.
     * @param {Array<string>} paths - Array de partes del camino.
     * @returns {Array} - Array de valores encontrados.
     */
    getValuesAtPath(obj, paths) {
      if (paths.length === 0) return [obj];
      const [currentPath, ...restPaths] = paths;
      let results = [];
      if (typeof obj === "undefined" || obj === null) return results;

      if (currentPath.endsWith("[]")) {
        const key = currentPath.slice(0, -2);
        const arr = obj[key];
        if (!Array.isArray(arr)) return [];
        arr.forEach((item) => {
          results = results.concat(this.getValuesAtPath(item, restPaths));
        });
      } else {
        const nextObj = obj[currentPath];
        results = results.concat(this.getValuesAtPath(nextObj, restPaths));
      }
      return results;
    },

    /**
     * Extrae valores de un paquete basado en la clave del filtro.
     * @param {Object} pkg - El paquete.
     * @param {string} filterKey - La clave del filtro.
     * @returns {Array<string>} - Lista de valores en minúscula.
     */
    extractPackageValues(pkg, filterKey) {
      const configItem = Filters.config.find(
        (config) => config.id === filterKey
      );
      if (!configItem || !configItem.grouper) return [];
      const paths = configItem.grouper.split(".");
      const values = this.getValuesAtPath(pkg, paths);
      return values
        .filter((val) => val !== undefined && val !== null)
        .map((val) => String(val).toLowerCase());
    },

    /**
     * Aplica los filtros seleccionados a un array de paquetes.
     * @param {Array} packages - Array de paquetes.
     * @param {Object} selectedFilters - Filtros seleccionados.
     * @returns {Array} - Paquetes filtrados.
     */
    applySelectedFilters(packages, selectedFilters) {
      if (!Array.isArray(packages) || packages.length === 0) return [];
      if (!selectedFilters || Object.keys(selectedFilters).length === 0)
        return packages;

      return packages.filter((pkg) => {
        return Object.keys(selectedFilters).every((filterKey) => {
          const filterValues = selectedFilters[filterKey];
          if (!Array.isArray(filterValues) || filterValues.length === 0)
            return true;

          const packageValues = this.extractPackageValues(pkg, filterKey);
          if (!Array.isArray(packageValues) || packageValues.length === 0)
            return false;

          const normalizedFilterValues = filterValues.map((value) =>
            value.toLowerCase()
          );
          return normalizedFilterValues.some((filterValue) =>
            packageValues.includes(filterValue)
          );
        });
      });
    },
  },
  detail: {},
};

export default pcomService;
