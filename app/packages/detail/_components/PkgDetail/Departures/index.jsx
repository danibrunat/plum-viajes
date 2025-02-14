import { Suspense } from "react";
import DeparturesForm from "./Form";
import { ProviderService } from "../../../../../api/services/providers.service";
import { ApiUtils } from "../../../../../api/services/apiUtils.service";
import { OLA } from "../../../../../api/services/ola.service";
import Placeholder from "./Placeholder";
import { groq } from "next-sanity";
import { sanityFetch } from "../../../../../../sanity/lib/sanityFetch";

// Obtener el primer y último día del mes
function getFirstAndLastDayOfMonth(dateString) {
  const date = new Date(`${dateString}T00:00:00Z`);
  const firstDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)
  );
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)
  );

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
      acc.push({ date: departureDate });
    }
    return acc;
  }, []);
}

// Función específica para obtener salidas del proveedor OLA
async function getOLAFlights(
  departureCity,
  arrivalCity,
  startDate,
  occupancy,
  id,
  priceId
) {
  const roomConfig = ProviderService.getRoomsConfig(occupancy);
  const xmlRooms =
    ProviderService.ola.generateXMLRoomsByConfigString(roomConfig);
  const { lastDayOfMonth } = getFirstAndLastDayOfMonth(startDate);

  const getPackagesFaresRequestForMonth = `<GetPackagesFaresRequest>
    <GeneralParameters>
      <Username>${process.env.OLA_USERNAME}</Username>
      <Password>${process.env.OLA_API_KEY}</Password>
      <CustomerIp>186.57.221.35</CustomerIp>
    </GeneralParameters>
    <DepartureDate>
      <From>${startDate}</From>
      <To>${lastDayOfMonth}</To>
    </DepartureDate>
    ${xmlRooms}
    <DepartureDestination>${departureCity}</DepartureDestination>
    <ArrivalDestination>${arrivalCity}</ArrivalDestination>
    <FareCurrency>ARS</FareCurrency>
    <Outlet>1</Outlet>
    <PackageType>ALL</PackageType>
  </GetPackagesFaresRequest>`;

  const cacheKey = `${id}-${priceId}`;
  const monthCacheKey = `month-${cacheKey}`;
  const response = await ApiUtils.requestHandler(
    fetch(
      OLA.detail.url(),
      OLA.detail.options(getPackagesFaresRequestForMonth, `${monthCacheKey}`)
    ),
    "pkgSearch"
  );

  const data = await response.json();
  const mappedResponseForMonth = ProviderService.mapper(data, "ola", "detail");
  return unifyDepartures(mappedResponseForMonth).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

// Función para determinar el tipo de habitación basado en el roomConfig
function getRoomType(roomConfig) {
  if (!roomConfig.length) return null;

  // Solo tomamos la primera habitación para determinar el tipo
  const { adults, children } = roomConfig[0];
  console.log("roomConfig", roomConfig);
  if (adults === 2) return "double";
  if (adults === 3 && children.length === 0) return "triple";
  if (adults === 4 && children.length === 0) return "quadruple";
  if (adults === 2 && children.length === 1) return "familyOne";
  if (adults === 2 && children.length === 2) return "familyTwo";
}

// Modificación en getPlumFlights para filtrar precios según el tipo de habitación
async function getPlumFlights(
  departureCity,
  arrivalCity,
  startDate,
  occupancy,
  id,
  priceId
) {
  // Obtener configuración de habitaciones desde occupancy
  const roomConfig = ProviderService.getRoomsConfig(occupancy);
  const selectedRoomType = getRoomType(roomConfig);

  const pkgAvailQuery = groq`
    *[_type == "packages" 
      && "${departureCity}" in origin
      && "${arrivalCity}" in destination
      && now() > validDateFrom 
      && now() < validDateTo
      ] {
      ...,
      "subtitle" : "Paquetes a " + origin[0] + " con aéreo " + departures[0].typeRt1 + " de " + departures[0].airlineRt1,
      "departures": departures[departureFrom > now()]
    }`;

  const sanityQuery = await sanityFetch({ query: pkgAvailQuery });
  const pkgAvailResponse = await sanityQuery;

  const onlyPkgWithDepartures = pkgAvailResponse.filter(
    (pkg) => pkg.departures.length > 0
  );

  const mapResponse = ProviderService.mapper(
    onlyPkgWithDepartures,
    "plum",
    "detail"
  );

  // Filtrar precios dentro de las `departures`
  const filteredPackages = mapResponse
    .map((pkg) => ({
      ...pkg,
      departures: pkg.departures
        .map((departure) => ({
          ...departure,
          prices: departure.prices.filter(
            (price) => price.type === selectedRoomType
          ),
        }))
        .filter((departure) => departure.prices.length > 0), // Eliminar departures sin precios válidos
    }))
    .filter((pkg) => pkg.departures.length > 0); // Eliminar paquetes sin departures válidas

  // Devolvemos solo las fechas únicas de `departureFrom`
  return unifyDepartures(filteredPackages).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

const FormWrapper = async ({
  departureCity,
  arrivalCity,
  startDate,
  occupancy,
  id,
  priceId,
  provider,
}) => {
  let departures = [];
  if (provider === "ola") {
    departures = await getOLAFlights(
      departureCity,
      arrivalCity,
      startDate,
      occupancy,
      id,
      priceId
    );
  } else if (provider === "plum") {
    departures = await getPlumFlights(
      departureCity,
      arrivalCity,
      startDate,
      occupancy,
      id,
      priceId
    );
  }

  return <DeparturesForm departures={departures} />;
};

const Departures = ({ searchParams }) => {
  const {
    provider,
    id,
    arrivalCity,
    departureCity,
    startDate,
    priceId,
    occupancy,
  } = searchParams;

  return (
    <div>
      <h1>Reservar Salida</h1>
      <Suspense fallback={<Placeholder />}>
        <FormWrapper
          departureCity={departureCity}
          arrivalCity={arrivalCity}
          startDate={startDate}
          occupancy={occupancy}
          id={id}
          priceId={priceId}
          provider={provider}
        />
      </Suspense>
    </div>
  );
};

export default Departures;
