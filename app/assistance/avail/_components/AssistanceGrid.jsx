import { AssistanceCard } from "./AssistanceCard";

export function AssistanceGrid({ plans, searchParams }) {
  if (!plans || plans.length === 0) {
    return (
      <div className="text-center text-gray-600 py-10">
        No encontramos asistencias para tu busqueda. Proba ajustando las fechas o destino.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {plans.map((plan) => (
        <AssistanceCard key={plan.id} plan={plan} searchParams={searchParams} />
      ))}
    </div>
  );
}
