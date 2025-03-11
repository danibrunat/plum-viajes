import RedisService from "./redis.service";

const PackageApiService = {
  departures: {
    plum: {
      getDeparturesGroup: (plumPkgAvailResponse) => {
        const departuresGroup = plumPkgAvailResponse.map((pkgItem) => {
          return {
            pkgId: pkgItem._id,
            departures: pkgItem.departures.map((pkgDepartureItem) => {
              return {
                id: pkgDepartureItem.id,
                date: pkgDepartureItem.departureFrom,
              };
            }),
          };
        });
        return departuresGroup;
      },
    },
    ola: {
      getDeparturesGroup: (olaPkgAvailResponse) => {
        const groupedPackages = {};
        olaPkgAvailResponse.forEach((pkg) => {
          const packageId = pkg.Package.Code; // ID único del paquete
          const departureId = pkg.id;
          const departureDate = pkg.Flight?.Trips?.Trip?.[0]?.DepartureDate;

          if (!groupedPackages[packageId]) {
            groupedPackages[packageId] = {
              pkgId: packageId,
              departures: [],
            };
          }

          if (departureDate) {
            groupedPackages[packageId].departures.push({
              id: departureId,
              date: departureDate,
            });
          }
        });

        // Eliminar duplicados usando un Map basado en id y ordenar por fecha
        return Object.values(groupedPackages).map((group) => ({
          ...group,
          departures: Array.from(
            new Map(group.departures.map((dep) => [dep.id, dep])).values()
          ).sort((a, b) => a.date.localeCompare(b.date)),
        }));
      },
    },
  },
  cache: {
    /**
     * Obtiene los paquetes en cache según la key única.
     * @param {object} pkgId - Parámetros de búsqueda.
     * @returns {object|null} Data almacenada o null si no existe.
     */
    async get(pkgId) {
      const cachedData = await RedisService.get(pkgId);
      if (!cachedData) return null; // Si no hay datos, devolvemos null

      return cachedData;
    },

    /**
     * Guarda la response de paquetes en cache usando una key única.
     * @param {object} pkgDepartures - Objeto pkgId, departures. pkgId será la clave.
     * @param {number} expireInSeconds - Tiempo de expiración en segundos (default 3600).
     */
    async set(pkgDepartures, expireInSeconds = 3600) {
      const pipelineItems = pkgDepartures.map((pkg) => ({
        key: pkg.pkgId,
        value: pkg.departures,
        expireInSeconds,
      }));

      await RedisService.pipelineSet(pipelineItems);
    },

    /**
     * Elimina la cache de paquetes de una consulta específica.
     * @param {object} searchParams - Parámetros de búsqueda.
     */
    async delete(searchParams) {
      const cacheKey = generateCacheKey(searchParams);
      await RedisService.delete(cacheKey);
    },
  },
};

export default PackageApiService;
