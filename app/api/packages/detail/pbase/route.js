import { groq } from "next-sanity";
import { sanityFetch } from "../../../../../sanity/lib/sanityFetch";
import { ProviderService } from "../../../services/providers.service";
import { OLA } from "../../../services/ola.service";

async function fetchPlumPackageDetail(id) {
  const pkgDetailQuery = groq`*[
    _id == "${id}" && 
    now() > validDateFrom && 
    now() < validDateTo]
    {
    ...,
    "subtitle" : "Paquetes a " + origin[0] + " con aéreo " + departures[0].typeRt1 + " de " + departures[0].airlineRt1,
    "departures": departures[departureFrom > now()]
   }`;

  const sanityQuery = await sanityFetch({ query: pkgDetailQuery });
  const pkgDetailResponse = await sanityQuery;
  // console.log("PLUM | pkgAvailResponse", pkgAvailResponse);
  const mapResponse = ProviderService.mapper(
    pkgDetailResponse,
    "plum",
    "detail"
  );
  // TODO refactor when detail mapper is ready
  return Response.json(mapResponse[0]);
}

async function fetchOlaPackageDetail(id, searchParams) {
  const { departureCity, arrivalCity, startDate, endDate, priceId, rooms } =
    searchParams;
  const cacheKey = `${id}-${priceId}`;

  const roomConfig = ProviderService.getRoomsConfig(rooms);
  const xmlRooms =
    ProviderService.ola.generateXMLRoomsByConfigString(roomConfig);

  // Generar requests XML
  const getPackagesFaresRequest = generateXMLRequest(
    departureCity,
    arrivalCity,
    startDate,
    endDate,
    xmlRooms
  );
  const getPackagesFaresRequestForMonth = generateXMLRequestForMonth(
    departureCity,
    arrivalCity,
    startDate,
    xmlRooms
  );

  try {
    const [olaPkgSearchResponse, olaPkgSearchForDepartureDatesResponse] =
      await Promise.all([
        fetch(
          OLA.detail.url(),
          OLA.detail.options(getPackagesFaresRequest, `${cacheKey}`)
        ),
        fetch(
          OLA.detail.url(),
          OLA.detail.options(
            getPackagesFaresRequestForMonth,
            `month-${cacheKey}`
          )
        ),
      ]);

    const olaResponse = await olaPkgSearchResponse.json();
    const olaDepartureDatesResponse =
      await olaPkgSearchForDepartureDatesResponse.json();

    if (olaResponse.length === 0) return olaResponse;
    if (olaDepartureDatesResponse.length === 0)
      return olaDepartureDatesResponse;

    // Mapeo de ambas respuestas
    const mappedOriginalResponse = ProviderService.mapper(
      olaResponse,
      "ola",
      "detail"
    );
    const mappedResponseForMonth = ProviderService.mapper(
      olaDepartureDatesResponse,
      "ola",
      "detail"
    );

    // Filtrar paquete por id y priceId
    const selectedPackage = mappedOriginalResponse.find(
      (pkg) => pkg.id === id && pkg.prices.id == priceId
    );

    // Unificar salidas del mes completo
    const unifiedDepartures = unifyDepartures(mappedResponseForMonth);
    //console.log("unifiedDepartures", unifiedDepartures);
    // Combinar paquete seleccionado y las salidas
    return {
      ...selectedPackage,
      departures: unifiedDepartures,
    };
  } catch (error) {
    console.error("Error fetching OLA package detail:", error);
    throw new Error("Error fetching package detail");
  }
}

// Genera el request XML para GetPackagesFares
function generateXMLRequest(
  departureCity,
  arrivalCity,
  fromDate,
  toDate,
  xmlRooms
) {
  return `<GetPackagesFaresRequest>
      <GeneralParameters>
        <Username>${process.env.OLA_USERNAME}</Username>
        <Password>${process.env.OLA_API_KEY}</Password>
        <CustomerIp>186.57.221.35</CustomerIp>
      </GeneralParameters>
      <DepartureDate>
        <From>${fromDate}</From>
        <To>${toDate}</To>
      </DepartureDate>
      ${xmlRooms}
      <DepartureDestination>${departureCity}</DepartureDestination>
      <ArrivalDestination>${arrivalCity}</ArrivalDestination>
      <FareCurrency>ARS</FareCurrency>
      <Outlet>1</Outlet>
      <PackageType>ALL</PackageType>
    </GetPackagesFaresRequest>`;
}

// Genera el request XML para todo el mes basado en startDate
function generateXMLRequestForMonth(
  departureCity,
  arrivalCity,
  startDate,
  xmlRooms
) {
  const { firstDayOfMonth, lastDayOfMonth } =
    getFirstAndLastDayOfMonth(startDate);

  return generateXMLRequest(
    departureCity,
    arrivalCity,
    firstDayOfMonth, // Ya está en formato 'DD-MM-YYYY'
    lastDayOfMonth, // Ya está en formato 'DD-MM-YYYY'
    xmlRooms
  );
}

// Obtener el primer y último día del mes dado un startDate
function getFirstAndLastDayOfMonth(dateString) {
  // Crear la fecha en UTC para evitar problemas de zona horaria
  const date = new Date(`${dateString}T00:00:00Z`);

  // Obtener el primer día del mes en UTC
  const firstDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)
  );

  // Obtener el último día del mes en UTC
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
  );

  // Función para formatear la fecha en formato "YYYY-MM-DD"
  const formatDate = (date) =>
    `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

  return {
    firstDayOfMonth: formatDate(firstDay),
    lastDayOfMonth: formatDate(lastDay),
  };
}

// Unificar salidas basadas en el array mapeado del mes completo
function unifyDepartures(packagesForMonth) {
  return packagesForMonth.reduce((acc, pkg) => {
    const departureDate = pkg?.departures?.date;

    if (
      departureDate &&
      !acc.find((departure) => departure.date === departureDate)
    ) {
      acc.push({
        date: departureDate,
      });
    }

    return acc;
  }, []);
}

/* async function fetchJuliaPackageDetail(searchParams) {
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
    "detail"
  );
  //console.log("fetchJuliaPackages | pkgAvail ", juliaPkgResponse);
  return Response.json(mapResponse);
} */

export async function POST(req, res) {
  const body = await req.json();
  const {
    provider,
    id,
    departureCity,
    arrivalCity,
    startDate,
    endDate,
    priceId,
    rooms,
  } = body;
  const searchParams = {
    departureCity,
    arrivalCity,
    startDate,
    endDate,
    priceId,
    rooms,
  };
  // check the provider and fetch the corresponding package detail
  switch (provider) {
    case "plum":
      const plumPkgDetail = await fetchPlumPackageDetail(id);
      const response = await plumPkgDetail.json();
      return Response.json(response);
    case "ola":
      const olaPkgDetail = await fetchOlaPackageDetail(id, searchParams);
      return Response.json(olaPkgDetail);
    case "julia":
    /*  const juliaPkgDetail = await fetchJuliaPackageDetail(id);
      const responseJulia = await juliaPkgDetail.json();
      return Response.json(responseJulia); */
  }
}
