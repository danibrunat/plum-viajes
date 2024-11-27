import { groq } from "next-sanity";
import { sanityFetch } from "../../../../../sanity/lib/sanityFetch";
import { Julia } from "../../../services/julia.service";
import { ProviderService } from "../../../services/providers.service";
import { OLA } from "../../../services/ola.service";
import { Filters } from "../../../services/filters.service";

/**
 * Filtra los paquetes de acuerdo a los filtros seleccionados por el usuario.
 *
 * @param {Array} packages - Lista de paquetes disponibles.
 * @param {Object} selectedFilters - Filtros aplicados por el usuario.
 * @returns {Array} - Paquetes que coinciden con los filtros seleccionados.
 */
function applySelectedFilters(packages, selectedFilters) {
  // Verificamos si los paquetes son válidos
  if (!Array.isArray(packages) || packages.length === 0) {
    return []; // Retornamos un array vacío si no hay paquetes
  }

  // Si no hay filtros seleccionados, devolvemos todos los paquetes
  if (!selectedFilters || Object.keys(selectedFilters).length === 0) {
    return packages;
  }

  // Filtramos los paquetes que coinciden con todos los filtros seleccionados
  return packages.filter((pkg) => {
    return Object.keys(selectedFilters).every((filterKey) => {
      const filterValues = selectedFilters[filterKey];

      // Si no hay valores seleccionados para este filtro, lo ignoramos
      if (!Array.isArray(filterValues) || filterValues.length === 0) {
        return true;
      }

      // Extraemos los valores correspondientes del paquete
      const packageValues = extractPackageValues(pkg, filterKey);

      // Si no hay valores en el paquete para este filtro, no coincide
      if (!Array.isArray(packageValues) || packageValues.length === 0) {
        return false;
      }

      // Normalizamos los valores a minúsculas para compararlos
      const normalizedFilterValues = filterValues.map((value) =>
        value.toLowerCase()
      );
      const normalizedPackageValues = packageValues.map((value) =>
        value.toLowerCase()
      );

      // Verificamos si hay intersección entre los valores seleccionados y los valores del paquete
      return normalizedFilterValues.some((filterValue) =>
        normalizedPackageValues.includes(filterValue)
      );
    });
  });
}

/**
 * Extrae los valores de un paquete basándose en la clave del filtro.
 *
 * @param {Object} pkg - El paquete que contiene la información.
 * @param {string} filterKey - La clave del filtro para extraer el valor correspondiente.
 * @returns {Array} - Lista de valores que corresponden a la clave del filtro.
 */
function extractPackageValues(pkg, filterKey) {
  const configItem = Filters.config.find((config) => config.id === filterKey);
  if (!configItem) return [];

  const paths = configItem.grouper.split(".");
  let current = pkg;

  // Iteramos sobre los niveles anidados en la ruta (definida en `grouper`)
  for (let path of paths) {
    if (path.endsWith("[]")) {
      const arrayKey = path.slice(0, -2);
      if (Array.isArray(current[arrayKey])) {
        // Accedemos al array y verificamos que el item sea un objeto y tenga el valor esperado
        return current[arrayKey]
          .map((item) =>
            typeof item === "object" ? item[paths[paths.length - 1]] : item
          )
          .filter(Boolean) // Filtramos valores nulos o indefinidos
          .map((item) => item.toLowerCase()); // Convertimos a minúsculas
      }
      return [];
    }
    current = current[path];
    if (!current) return [];
  }

  return [current.toLowerCase()]; // Convertimos a minúsculas el valor final
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
    && "${arrivalCity}" in destination
    && now() > validDateFrom 
    && now() < validDateTo] {
    ...,
    "subtitle" : "Paquetes a " + origin[0] + " con aéreo " + departures[0].typeRt1 + " de " + departures[0].airlineRt1,
    "departures": departures[departureFrom > now()]
   }`;

  const sanityQuery = await sanityFetch({ query: pkgAvailQuery });
  const pkgAvailResponse = await sanityQuery;

  // Mapeamos la respuesta para adaptarla a nuestro formato interno
  const mapResponse = ProviderService.mapper(pkgAvailResponse, "plum", "avail");
  return Response.json(mapResponse);
}

/**
 * Obtiene paquetes disponibles desde el proveedor OLA.
 *
 * @param {Object} searchParams - Parámetros de búsqueda (ciudad de llegada, salida, fechas, habitaciones).
 * @returns {Promise<Object>} - Paquetes disponibles agrupados por OLA.
 */
async function fetchOlaPackages(searchParams) {
  const { departureCity, arrivalCity, startDate, endDate, rooms } =
    searchParams;
  const formattedDateFrom = ProviderService.ola.olaDateFormat(startDate);
  const formattedDateTo = ProviderService.ola.olaDateFormat(endDate);

  const getPackagesFaresRequest = `<GetPackagesFaresRequest>
    <GeneralParameters>
      <Username>${process.env.OLA_USERNAME}</Username>
      <Password>${process.env.OLA_API_KEY}</Password>
      <CustomerIp>186.57.221.35</CustomerIp>
    </GeneralParameters>
    <DepartureDate>
      <From>${formattedDateFrom}</From>
      <To>${formattedDateTo}</To>
    </DepartureDate>
    <Rooms>
      <Room>
        <Passenger Type="ADL"/>
        <Passenger Type="ADL"/>
      </Room>
    </Rooms>
    <DepartureDestination>${departureCity}</DepartureDestination>
    <ArrivalDestination>${arrivalCity}</ArrivalDestination>
    <FareCurrency>ARS</FareCurrency>
    <Outlet>1</Outlet>
    <PackageType>ALL</PackageType>
  </GetPackagesFaresRequest>`;

  try {
    const olaAvailRequest = await fetch(
      OLA.avail.url(),
      OLA.avail.options(getPackagesFaresRequest)
    );
    const olaAvailResponse = await olaAvailRequest.json();
    console.log("olaAvailResponse", JSON.stringify(olaAvailResponse[0]));
    const mapResponse = ProviderService.mapper(
      olaAvailResponse,
      "ola",
      "avail"
    );
    return ProviderService.ola.grouper(mapResponse);
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
  const occupation = "2";

  const juliaPkgResponse = await Julia.pkgAvail({
    arrivalCity,
    departureCity,
    departureFrom,
    departureTo,
    occupation,
  });
  const mapResponse = ProviderService.mapper(
    juliaPkgResponse,
    "julia",
    "avail"
  );
  return Response.json(mapResponse);
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
  const packagesResponse = plumPkgResponse.concat(olaPkg);

  // Procesar los filtros de los paquetes obtenidos
  const filters = await Filters.process(packagesResponse);

  // Aplicar los filtros seleccionados
  const filteredPackages = applySelectedFilters(
    packagesResponse || [],
    selectedFilters || {}
  );

  return Response.json({ packages: filteredPackages, filters });
}
