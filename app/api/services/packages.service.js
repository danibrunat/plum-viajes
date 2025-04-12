import RedisService from "./redis.service";

const PackageApiService = {
  departures: {
    plum: {
      getDeparturesGroup: (plumPkgAvailResponse) => {
        return plumPkgAvailResponse.map((pkgItem) => ({
          pkgId: pkgItem._id,
          departures: pkgItem.departures.map((pkgDepartureItem) => ({
            id: pkgDepartureItem.id,
            date: pkgDepartureItem.departureFrom,
          })),
        }));
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
     * Obtiene un paquete en cache según la key (pkgId).
     * @param {string} pkgId - La clave a consultar.
     * @returns {Promise<object|null>} Data almacenada o null si no existe.
     */
    get: async (pkgId) => {
      try {
        return await RedisService.get(pkgId);
      } catch (error) {
        console.error(`Error al obtener ${pkgId} de cache:`, error);
        return null;
      }
    },

    /**
     * Guarda múltiples pkgDepartures en cache usando pipelining.
     * Se asume que pkgDepartures es un array de objetos con { pkgId, departures }.
     * @param {Array} pkgDepartures
     * @param {number} expireInSeconds
     */
    set: async (pkgDepartures, expireInSeconds = 3600) => {
      try {
        const pipelineItems = pkgDepartures.map((pkg) => ({
          key: pkg.pkgId,
          value: pkg.departures,
          expireInSeconds,
        }));
        await RedisService.pipelineSet(pipelineItems);
      } catch (error) {
        console.error("Error al establecer valores en cache:", error);
      }
    },

    /**
     * Guarda en cache sólo aquellos pkgDepartures cuyo pkgId no exista ya en Redis.
     * @param {Array} pkgDepartures
     * @param {number} expireInSeconds
     */
    setIfNotExists: async (pkgDepartures, expireInSeconds) => {
      try {
        // Extraer todas las keys (pkgId) del array
        const keys = pkgDepartures.map((pkg) => pkg.pkgId);
        // Consultar Redis por esos keys
        const existingValues = await RedisService.pipelineGet(keys);
        // Filtrar aquellos que no existen (null)
        const newPackages = pkgDepartures.filter(
          (pkg, index) => existingValues[index] === null
        );
        if (newPackages.length > 0) {
          const pipelineItems = newPackages.map((pkg) => ({
            key: pkg.pkgId,
            value: pkg.departures,
            expireInSeconds,
          }));
          await RedisService.pipelineSet(pipelineItems);
        }
      } catch (error) {
        console.error("Error en setIfNotExists:", error);
      }
    },

    /**
     * Elimina la cache de paquetes de una consulta específica.
     * @param {object} searchParams - Parámetros de búsqueda.
     */
    delete: async (searchParams) => {
      try {
        const cacheKey = generateCacheKey(searchParams);
        await RedisService.delete(cacheKey);
      } catch (error) {
        console.error("Error al eliminar cache:", error);
      }
    },
  },
};

export default PackageApiService;
