import { groq } from "next-sanity";
import { sanityFetch } from "../../../../../sanity/lib/sanityFetch";
import { Julia } from "../../../services/julia.service";
import { ProviderService } from "../../../services/providers.service";
import { OLA } from "../../../services/ola.service";
import { Filters } from "../../../services/filters.service";
import CryptoService from "../../../services/cypto.service";
import PackageApiService from "../../../services/packages.service";

/**
 * Filtra los paquetes de acuerdo a los filtros seleccionados por el usuario.
 *
 * @param {Array} packages - Lista de paquetes disponibles.
 * @param {Object} selectedFilters - Objeto con los filtros aplicados, por ejemplo:
 *   { mealPlan: ['desayuno'], night: ['4'], rating: ['3'], hotel: ['guamini mision'] }
 * @returns {Array} - Paquetes que coinciden con los filtros seleccionados.
 */
function applySelectedFilters(packages, selectedFilters) {
  // Si no hay paquetes o no es un array, retorna vacío.
  if (!Array.isArray(packages) || packages.length === 0) {
    return [];
  }

  // Si no hay filtros seleccionados, devuelve todos los paquetes.
  if (!selectedFilters || Object.keys(selectedFilters).length === 0) {
    return packages;
  }

  // Filtrar cada paquete según cada filtro seleccionado.
  return packages.filter((pkg) => {
    // Para cada filtro, se verifica que exista al menos una coincidencia
    return Object.keys(selectedFilters).every((filterKey) => {
      const filterValues = selectedFilters[filterKey];

      // Si no hay valores seleccionados para este filtro, se ignora.
      if (!Array.isArray(filterValues) || filterValues.length === 0) {
        return true;
      }

      // Extraemos los valores del paquete para este filtro (normalizados a minúsculas).
      const packageValues = extractPackageValues(pkg, filterKey);

      // Si no se encontraron valores en el paquete, no cumple el filtro.
      if (!Array.isArray(packageValues) || packageValues.length === 0) {
        return false;
      }

      // Se normalizan los valores seleccionados.
      const normalizedFilterValues = filterValues.map((value) =>
        value.toLowerCase()
      );

      // Verificar si existe intersección: al menos un valor del filtro se encuentra en los valores del paquete.
      return normalizedFilterValues.some((filterValue) =>
        packageValues.includes(filterValue)
      );
    });
  });
}
/**
 * Función recursiva que recorre un objeto (o array) según un camino (path)
 * y retorna un array con todos los valores encontrados.
 *
 * @param {Object|Array} obj - Objeto o array actual.
 * @param {Array<string>} paths - Array de partes del camino.
 * @returns {Array} - Array de valores encontrados.
 */
function getValuesAtPath(obj, paths) {
  if (paths.length === 0) {
    return [obj];
  }

  const [currentPath, ...restPaths] = paths;
  let results = [];

  if (typeof obj === "undefined" || obj === null) {
    return results;
  }

  if (currentPath.endsWith("[]")) {
    const key = currentPath.slice(0, -2);
    const arr = obj[key];
    if (!Array.isArray(arr)) return [];
    arr.forEach((item) => {
      results = results.concat(getValuesAtPath(item, restPaths));
    });
  } else {
    const nextObj = obj[currentPath];
    results = results.concat(getValuesAtPath(nextObj, restPaths));
  }

  return results;
}

/**
 * Extrae los valores de un paquete basándose en la clave del filtro.
 *
 * La función utiliza la propiedad "grouper" definida en Filters.config para determinar
 * la ruta (con notación dot y "[]" para arrays) y retorna todos los valores encontrados,
 * normalizados a minúsculas.
 *
 * @param {Object} pkg - El paquete que contiene la información.
 * @param {string} filterKey - La clave del filtro para extraer el valor correspondiente.
 * @returns {Array<string>} - Lista de valores (en minúscula) extraídos del paquete.
 */
function extractPackageValues(pkg, filterKey) {
  const configItem = Filters.config.find((config) => config.id === filterKey);
  if (!configItem || !configItem.grouper) return [];

  const paths = configItem.grouper.split(".");
  const values = getValuesAtPath(pkg, paths);

  return values
    .filter((val) => val !== undefined && val !== null)
    .map((val) => String(val).toLowerCase());
}

/**
 * Obtiene paquetes disponibles desde el proveedor Plum usando Sanity.
 *
 * @param {Object} params - Parámetros de búsqueda (ciudad de llegada, salida, fechas).
 * @returns {Promise<Response>} - Respuesta con los paquetes disponibles.
 */
async function fetchPlumPackages({
  arrivalCity,
  departureCity,
  startDate,
  endDate,
}) {
  // Consulta GROQ para obtener paquetes desde Sanity
  const pkgAvailQuery = groq`*[_type == "packages" 
    && "${departureCity}" in origin
    && "${arrivalCity}" in destination[]->iata_code
    && now() > validDateFrom 
    && now() < validDateTo
    && active == true] {
    ...,
    "subtitle" : "Paquetes a " + origin[0] + " con aéreo " + departures[0].typeRt1 + " de " + departures[0].airlineRt1->name,
    
    // Filtramos las salidas que tienen fechas válidas
    "departures": departures[departureFrom >= "${startDate}" && departureFrom < "${endDate}"] {
      ...,
      
      // Desreferenciar el array de hoteles
      "hotels": hotels[]-> {
        name, 
        stars, 
        description, 
        latitude, 
        longitude, 
        plum_id,
        
        // Desreferenciamos la ciudad
        "city": city_id-> {
          iata_code,
          name,
          country_name
        }
      },
      
      "airlineRt1": airlineRt1-> {
        code,
        name
      },
      "airlineRt2": airlineRt2-> {
        code,
        name
      }
    }
  }`;

  const sanityQuery = await sanityFetch({ query: pkgAvailQuery });
  const pkgAvailResponse = await sanityQuery;
  const onlyPkgWithDepartures = pkgAvailResponse.filter(
    (pkg) => pkg.departures.length > 0
  );
  // Generar departureId en cada objeto de departures sin alterar la estructura

  const pkgWithIdentifiedDepartures = onlyPkgWithDepartures.map((pkg) => {
    return {
      ...pkg,
      departures: pkg.departures.map((departure) => ({
        ...departure,
        id: CryptoService.generateDepartureId("plum", departure.departureFrom),
      })),
    };
  });

  const departuresGroup = PackageApiService.departures.plum.getDeparturesGroup(
    pkgWithIdentifiedDepartures
  );

  // Mapeamos la respuesta para adaptarla a nuestro formato interno
  const mapResponse = {
    packages: ProviderService.mapper(
      pkgWithIdentifiedDepartures,
      "plum",
      "avail"
    ),
    departuresGroup,
  };

  return Response.json(mapResponse);
}

/**
 * Obtiene paquetes disponibles desde el proveedor OLA.
 *
 * @param {Object} searchParams - Parámetros de búsqueda (ciudad de llegada, salida, fechas, habitaciones).
 * @returns {Promise<Object>} - Paquetes disponibles agrupados por OLA.
 */
async function fetchOlaPackages(searchParams) {
  const getPackagesFaresRequest = OLA.avail.getRequest(searchParams);

  try {
    const olaAvailRequest = await fetch(
      OLA.avail.url(),
      OLA.avail.options(getPackagesFaresRequest)
    );
    const olaAvailResponse = await olaAvailRequest.json();

    const pkgWithIdentifiedDepartures = olaAvailResponse.map((pkg) => {
      return {
        ...pkg,
        id: CryptoService.generateDepartureId(
          "ola",
          pkg.Flight.Trips.Trip[0].DepartureDate
        ),
      };
    });

    const departuresGroup = PackageApiService.departures.ola.getDeparturesGroup(
      pkgWithIdentifiedDepartures
    );

    const mapResponse = ProviderService.mapper(
      pkgWithIdentifiedDepartures,
      "ola",
      "avail"
    );

    const groupedResponse = ProviderService.ola.grouper(mapResponse);

    const response = {
      packages: groupedResponse,
      departuresGroup,
    };

    return response;
  } catch (error) {
    console.error("Error fetching OLA packages", error);
  }
}

/**
 * Obtiene paquetes disponibles desde el proveedor Julia.
 *
 * @param {Object} searchParams - Parámetros de búsqueda.
 * @returns {Promise<Response>} - Respuesta con los paquetes disponibles.
 */
async function fetchJuliaPackages(searchParams) {
  const arrivalCity = "ASU";
  const departureCity = "BUE";
  const departureFrom = "2024-10-01";
  const departureTo = "2024-10-31";
  const occupancy = "2";

  const juliaPkgResponse = await Julia.pkgAvail({
    arrivalCity,
    departureCity,
    departureFrom,
    departureTo,
    occupancy,
  });
  const mapResponse = ProviderService.mapper(
    juliaPkgResponse,
    "julia",
    "avail"
  );
  return Response.json(mapResponse);
}

/**
 * Extrae un precio representativo para un paquete.
 * En este caso, se utiliza el menor basePrice encontrado en el array de departures.
 * Si no existen departures, se retorna Infinity para que el paquete quede al final.
 *
 * @param {Object} pkg - Un paquete con la propiedad departures.
 * @returns {number} El precio representativo (el mínimo basePrice).
 */
const getRepresentativePrice = (pkg) => {
  if (Array.isArray(pkg.departures) && pkg.departures.length > 0) {
    const prices = pkg.departures.map((dep) => {
      const price = dep?.prices?.pricesDetail?.basePrice;
      return Number(price) || Infinity;
    });
    return Math.min(...prices);
  }
  return Infinity;
};

/**
 * Ordena un array de paquetes por el basePrice (tomado de sus departures)
 * sin modificar la estructura original.
 *
 * @param {Array} packages - Array de objetos de paquete.
 * @param {string} priceOrder - Criterio de orden: "high" para ordenar de mayor a menor, cualquier otro valor para menor a mayor.
 * @returns {Array} Un nuevo array de paquetes ordenado según el precio.
 */
function sortPackagesByBasePrice(packages, priceOrder) {
  const isDescending = priceOrder === "high";
  // Creamos una copia del array original y lo ordenamos
  return [...packages].sort((a, b) => {
    const priceA = getRepresentativePrice(a);
    const priceB = getRepresentativePrice(b);
    // Si es descendente, los paquetes con mayor precio primero; si no, menor precio primero.
    return isDescending ? priceB - priceA : priceA - priceB;
  });
}

/**
 * Controlador para manejar las solicitudes POST.
 * Recibe los parámetros de búsqueda y los filtros seleccionados,
 * obtiene los paquetes de los proveedores y devuelve los resultados filtrados.
 *
 * @param {Request} req - Solicitud HTTP entrante.
 * @param {Response} res - Respuesta HTTP saliente.
 * @returns {Promise<Response>} - Paquetes filtrados y filtros disponibles.
 */
export async function POST(req, res) {
  const body = await req.json();
  const { searchParams, selectedFilters } = body;

  // Obtener los paquetes de los proveedores
  const [plumPkg, olaPkg] = await Promise.all([
    fetchPlumPackages(searchParams),
    fetchOlaPackages(searchParams),
  ]);

  const plumPkgResponse = await plumPkg.json();
  const packagesResponse = plumPkgResponse.packages.concat(olaPkg.packages);
  const departureGroups = plumPkgResponse.departuresGroup.concat(
    olaPkg.departuresGroup
  );
  // TODO: Mover esto a pcom

  const departureGroupInCache = await PackageApiService.cache.get(searchParams);
  if (!departureGroupInCache) {
    await PackageApiService.cache.set(searchParams, departureGroups, 3600);
  }

  // Procesar los filtros de los paquetes obtenidos
  const filters = await Filters.process(packagesResponse);
  // Aplicar los filtros seleccionados
  const filteredPackages = applySelectedFilters(
    packagesResponse,
    selectedFilters
  );

  const sortedPackages = sortPackagesByBasePrice(
    filteredPackages,
    searchParams.priceOrder
  );

  return Response.json({ packages: sortedPackages, filters });
}
