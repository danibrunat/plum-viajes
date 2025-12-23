import SearchEngines from "../../components/sections/SearchEngines";
import { AssistanceService } from "../../api/services/assistance";
import { AssistanceGrid } from "./_components/AssistanceGrid";

export const metadata = {
  title: "Asistencia al viajero | Plum Viajes",
  description: "Cotiza tu asistencia al viajero con Universal Assistance.",
};

export default async function AssistanceAvailability(props) {
  const searchParams = await props.searchParams;
  const { destination, startDate, endDate, travelers, age1, originCountry, tripType } = searchParams;

  const hasQuery = destination && startDate && endDate;
  const availability = hasQuery
    ? await AssistanceService.getAvailability({
        destination,
        startDate,
        endDate,
        travelers,
        age1,
        originCountry,
        tripType,
      })
    : { plans: [] };

  const plans = availability.plans || [];

  return (
    <>
      <SearchEngines assurances={true} defaultValues={{ assistance: searchParams }} />
      <div className="mx-2 py-2 md:py-5 md:mx-40">
        {hasQuery ? (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-plumPrimaryPurple">Asistencias disponibles</h2>
              <p className="text-sm text-gray-600">
                Destino: {destination} · {startDate} a {endDate} · {travelers || 1} viajero(s) · Edad1: {age1 || ""} · Origen: {originCountry || ""}
              </p>
            </div>
            <AssistanceGrid plans={plans} searchParams={searchParams} />
          </div>
        ) : (
          <div className="text-center text-gray-600 py-10">
            Ingresa destino y fechas para cotizar tu asistencia al viajero.
          </div>
        )}
      </div>
    </>
  );
}
