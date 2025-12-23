import SearchEngines from "../../components/sections/SearchEngines";
import { AssistanceService } from "../../api/services/assistance";
import { AssistanceDetail } from "./_components/AssistanceDetail";
import Link from "next/link";

export const metadata = {
  title: "Detalle asistencia al viajero | Plum Viajes",
  description: "Detalle del plan de asistencia Universal Assistance.",
};

export default async function AssistanceDetailPage(props) {
  const searchParams = await props.searchParams;
  const { id, destination, startDate, endDate, travelers, age1, originCountry, tripType } = searchParams;

  const plan = id
    ? await AssistanceService.getDetail(id, {
        destination,
        startDate,
        endDate,
        travelers,
        age1,
        originCountry,
        tripType,
      })
    : null;

  if (!plan) {
    return (
      <div className="mx-2 py-2 md:py-5 md:mx-40 flex flex-col gap-4">
        <SearchEngines assurances={true} defaultValues={{ assistance: searchParams }} />
        <div className="bg-white rounded border border-gray-200 shadow-sm p-6 text-center text-gray-700">
          No encontramos el plan seleccionado.
          <div className="mt-4">
            <Link href="/assistance/avail" className="text-plumPrimaryPurple hover:underline">
              Volver a buscar asistencias
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SearchEngines assurances={true} defaultValues={{ assistance: searchParams }} />
      <div className="mx-2 py-2 md:py-5 md:mx-40 flex flex-col gap-6">
        <AssistanceDetail plan={plan} />
        <em className="text-xs text-gray-500">
          Las condiciones de cobertura pueden variar segun pais y fechas. Confirmaremos la poliza al emitirla luego del pago.
        </em>
      </div>
    </>
  );
}
