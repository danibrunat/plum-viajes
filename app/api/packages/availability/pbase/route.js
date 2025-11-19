import { groq } from "next-sanity";
import { Julia } from "../../../services/julia.service";
import { ProviderService } from "../../../services/providers";
import { OLA } from "../../../services/ola.service";
import CryptoService from "../../../services/cypto.service";
import PackageApiService from "../../../services/packages.service";
import { sanityFetch } from "../../../../lib/sanityFetch";

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
    && now() >= validDateFrom 
    && now() <= validDateTo
    && active == true] {
    ...,
    "subtitle" : "Paquetes a " + origin[0] + " con aéreo " + departures[0].typeRt1 + " de " + departures[0].airlineRt1->name,
    
    // Filtramos las salidas que tienen fechas válidas
    "departures": departures[departureFrom >= "${startDate}" && departureFrom < "${endDate}"] {
      ...,
      
      // Desreferenciar el array de hoteles
      "hotels": hotels[]-> {
        _id,
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
        },
        // TODO: El mealPlan debe ir por hotel, no debería ser el mismo para todos.
        "mealPlan": ^.mealPlan,
        // TODO: No obtener el roomtype del tipo de price. Debemos refactorizar esto y ver si es necesario
        // Incluir el tipo de habitación.
        "roomType": ^.prices[0].type,
        "roomSize": ^.roomSize,
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

  // Ordenar las departures para que las agotadas se envíen al final
  const sortedPkgWithDepartures = onlyPkgWithDepartures.map((pkg) => {
    const sortedDepartures = pkg.departures.sort((a, b) => {
      return a.departureSeats === 0 ? 1 : b.departureSeats === 0 ? -1 : 0;
    });
    return {
      ...pkg,
      departures: sortedDepartures,
    };
  });

  // Generar departureId en cada objeto de departures sin alterar la estructura
  const pkgWithIdentifiedDepartures = sortedPkgWithDepartures.map((pkg) => {
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
  const juliaPkgResponse = await Julia.pkgAvail(searchParams);
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
 * obtiene los paquetes de los proveedores y devuelve los resultados.
 *
 * @param {Request} req - Solicitud HTTP entrante.
 * @param {Response} res - Respuesta HTTP saliente.
 * @returns {Promise<Response>} - Paquetes y filtros disponibles.
 */
export async function POST(req) {
  const body = await req.json();
  const { searchParams, provider } = body;

  if (provider) {
    // Si se especifica un provider, devolver solo ese
    switch (provider) {
      case "plum":
        return await fetchPlumPackages(searchParams);
      case "ola":
        const olaResponse = await fetchOlaPackages(searchParams);
        return Response.json(olaResponse);
      case "julia":
        return await fetchJuliaPackages(searchParams);
      default:
        return Response.json({ error: "Provider not found" }, { status: 400 });
    }
  }

  // Si no se especifica, devolver todos (comportamiento actual)
  const [plumPkg, olaPkg, juliaPkg] = await Promise.all([
    fetchPlumPackages(searchParams),
    fetchOlaPackages(searchParams),
    fetchJuliaPackages(searchParams),
  ]);

  const plumPkgResponse = await plumPkg.json();
  const juliaPkgResponse = await juliaPkg.json();
  const packagesResponse = plumPkgResponse.packages.concat(
    olaPkg.packages,
    juliaPkgResponse
  );

  console.log("packagesResponse", packagesResponse);
  /**
   * Preparar los grupos de salidas para ser almacenados en la cache.
   */
  const departureGroups = plumPkgResponse.departuresGroup.concat(
    olaPkg.departuresGroup
  );
  await PackageApiService.cache.setIfNotExists(departureGroups, 3600);

  return Response.json(packagesResponse);
}
