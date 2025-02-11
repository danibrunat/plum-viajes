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

// Función para obtener salidas del proveedor Plum (lógica futura)
async function getPlumFlights(
  departureCity,
  arrivalCity,
  startDate,
  occupancy,
  id,
  priceId
) {
  // Query a Sanity
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

  // Ejecutamos la query en Sanity
  const sanityQuery = await sanityFetch({ query: pkgAvailQuery });
  const pkgAvailResponse = await sanityQuery;

  // Filtramos solo paquetes que tengan `departures`
  const onlyPkgWithDepartures = pkgAvailResponse.filter(
    (pkg) => pkg.departures.length > 0
  );

  const mapResponse = ProviderService.mapper(
    onlyPkgWithDepartures,
    "plum",
    "detail"
  );

  // Devolvemos la respuesta con la lista de `departureFrom` para el FormWrapper
  return unifyDepartures(mapResponse).sort(
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
    console.log("plum departures", departures);
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
