import Link from "next/link";

export function AssistanceCard({ plan, searchParams }) {
  const detailParams = new URLSearchParams({
    id: plan.id,
    destination: searchParams.destination || "",
    startDate: searchParams.startDate || "",
    endDate: searchParams.endDate || "",
    travelers: searchParams.travelers || "1",
  });

  return (
    <div className="rounded border border-gray-200 bg-white shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-gray-500">{plan.provider}</p>
          <h3 className="text-lg font-semibold">{plan.name}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Desde</p>
          <p className="text-2xl font-bold text-plumPrimaryPurple">
            {plan.currency} {plan.price}
          </p>
          <p className="text-xs text-gray-500">Total: {plan.currency} {plan.total}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-gray-700">
        <span className="font-semibold">Cobertura:</span>
        <span>{plan.coverage}</span>
        <span className="text-gray-400">•</span>
        <span>{plan.duration}</span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
        {plan.perks?.map((perk) => (
          <span
            key={perk}
            className="bg-gray-100 text-gray-700 rounded-full px-3 py-1"
          >
            {perk}
          </span>
        ))}
      </div>

      <div className="flex justify-end">
        <Link
          href={`/assistance/detail?${detailParams.toString()}`}
          className="bg-plumPrimaryPurple text-white px-4 py-2 rounded hover:bg-plumPrimaryPurpleHover transition"
        >
          Ver detalle
        </Link>
      </div>
    </div>
  );
}
