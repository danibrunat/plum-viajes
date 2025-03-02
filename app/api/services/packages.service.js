import crypto from "crypto";
import RedisService from "./redis.service";

function generateCacheKey(searchParams) {
  const { departureCity, arrivalCity, startDate, initialDate } = searchParams;
  // Si initialDate existe, la usamos como startDate efectiva
  const effectiveStartDate = initialDate || startDate;

  // Construimos el objeto de parámetros normalizado usando effectiveStartDate
  const normalizedParams = JSON.stringify(
    {
      departureCity,
      arrivalCity,
      startDate: effectiveStartDate,
    },
    Object.keys({
      departureCity,
      arrivalCity,
      startDate: effectiveStartDate,
    }).sort()
  );

  // Generamos un hash SHA-256 para obtener una key compacta y única
  return crypto.createHash("sha256").update(normalizedParams).digest("hex");
}

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
     * @param {object} searchParams - Parámetros de búsqueda.
     * @returns {object|null} Data almacenada o null si no existe.
     */
    async get(searchParams) {
      const cacheKey = generateCacheKey(searchParams);
      const cachedData = await RedisService.get(cacheKey);
      if (!cachedData) return null; // Si no hay datos, devolvemos null

      return cachedData;
    },

    /**
     * Guarda la response de paquetes en cache usando una key única.
     * @param {object} searchParams - Parámetros de búsqueda.
     * @param {object} data - Data a almacenar.
     * @param {number} expireInSeconds - Tiempo de expiración en segundos (default 3600).
     */
    async set(searchParams, data, expireInSeconds = 3600) {
      const cacheKey = generateCacheKey(searchParams);
      await RedisService.set(cacheKey, JSON.stringify(data), expireInSeconds);
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
