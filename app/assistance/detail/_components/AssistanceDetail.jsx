import Link from "next/link";

export function AssistanceDetail({ plan }) {
  if (!plan) {
    return (
      <div className="text-center text-gray-600 py-10">
        No encontramos el plan seleccionado. Volve a la busqueda para elegir otra opcion.
      </div>
    );
  }

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-gray-500">{plan.provider}</p>
          <h1 className="text-2xl font-semibold">{plan.name}</h1>
          <p className="text-sm text-gray-600">Cobertura: {plan.coverage}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Precio por viajero</p>
          <p className="text-3xl font-bold text-plumPrimaryPurple">
            {plan.currency} {plan.price}
          </p>
          <p className="text-xs text-gray-500">Duracion: {plan.duration}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-800">Incluye</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {plan.inclusions?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">No cubre</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {plan.exclusions?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800">Beneficios destacados</h3>
        <div className="flex flex-wrap gap-2 text-xs text-gray-700">
          {plan.perks?.map((perk) => (
            <span
              key={perk}
              className="bg-gray-100 text-gray-700 rounded-full px-3 py-1"
            >
              {perk}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href={`/assistance/checkout?planId=${plan.id}`}
          className="bg-plumPrimaryPurple text-white px-5 py-3 rounded hover:bg-plumPrimaryPurpleHover transition"
        >
          Ir al checkout
        </Link>
      </div>
    </div>
  );
}
