import { Suspense } from "react";
import DeparturesForm from "./Form"; // Importa tu componente de formulario
import { ProviderService } from "../../../../../api/services/providers.service";
import { ApiUtils } from "../../../../../api/services/apiUtils.service";
import { OLA } from "../../../../../api/services/ola.service";
import Placeholder from "./Placeholder";
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
  const { lastDayOfMonth } = getFirstAndLastDayOfMonth(startDate);

  return generateXMLRequest(
    departureCity,
    arrivalCity,
    startDate, // Ya está en formato 'DD-MM-YYYY'
    lastDayOfMonth, // Ya está en formato 'DD-MM-YYYY'
    xmlRooms
  );
}

const FormWrapper = async ({
  departureCity,
  arrivalCity,
  startDate,
  occupancy,
  id,
  priceId,
}) => {
  const roomConfig = ProviderService.getRoomsConfig(occupancy);
  const xmlRooms =
    ProviderService.ola.generateXMLRoomsByConfigString(roomConfig);
  const getPackagesFaresRequestForMonth = generateXMLRequestForMonth(
    departureCity,
    arrivalCity,
    startDate,
    xmlRooms
  );

  const cacheKey = `${id}-${priceId}`;
  const monthCacheKey = `month-${cacheKey}`;
  const olaPkgDeparturesRequest = await ApiUtils.requestHandler(
    fetch(
      OLA.detail.url(),
      OLA.detail.options(getPackagesFaresRequestForMonth, `${monthCacheKey}`)
    ),
    "pkgSearch"
  );
  const olaDepartureDatesResponse = await olaPkgDeparturesRequest.json();
  const mappedResponseForMonth = ProviderService.mapper(
    olaDepartureDatesResponse,
    "ola",
    "detail"
  );

  const unifiedDepartures = unifyDepartures(mappedResponseForMonth);
  const sortedDepartures = unifiedDepartures.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return <DeparturesForm departures={sortedDepartures} />;
};

const Departures = ({ searchParams }) => {
  const {
    provider,
    id,
    arrivalCity,
    departureCity,
    startDate,
    endDate,
    priceId,
    occupancy,
  } = searchParams;

  return (
    <div>
      <h1>Reservar Salida</h1>
      {/* Usamos Suspense para manejar el estado de carga */}
      <Suspense fallback={<Placeholder />}>
        <FormWrapper
          departureCity={departureCity}
          arrivalCity={arrivalCity}
          startDate={startDate}
          occupancy={occupancy}
          id={id}
          priceId={priceId}
        />
      </Suspense>
    </div>
  );
};

export default Departures;
