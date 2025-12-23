const PROVIDER_AVAIL_ENDPOINT = "/api/providers/universal-assistance/avail";

const mockPlans = [
  {
    id: "ua-basic",
    name: "Universal Assistance Basic",
    provider: "Universal Assistance",
    price: 85,
    currency: "USD",
    coverage: "USD 50.000",
    duration: "7 dias",
    perks: ["Cobertura medica", "Asistencia legal", "Telemedicina"],
    description: "Cobertura esencial para viajes cortos en la region.",
  },
  {
    id: "ua-premium",
    name: "Universal Assistance Premium",
    provider: "Universal Assistance",
    price: 120,
    currency: "USD",
    coverage: "USD 150.000",
    duration: "10 dias",
    perks: ["Cobertura medica", "Equipaje", "Cancelacion", "Upgrade hotel"],
    description: "Cobertura ampliada con beneficios adicionales para viajes largos.",
  },
  {
    id: "ua-family",
    name: "Universal Assistance Family",
    provider: "Universal Assistance",
    price: 200,
    currency: "USD",
    coverage: "USD 200.000",
    duration: "14 dias",
    perks: ["Cobertura familiar", "Cancelacion", "Cobertura COVID"],
    description: "Disenada para grupos familiares con beneficios compartidos.",
  },
];

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

const toArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const extractPerks = (rawPlan) => {
  const attributes = rawPlan.Atributo || rawPlan.atributo || [];
  const list = toArray(attributes);
  return list
    .map((attr) => attr?.NombreVisible || attr?.Nombre || attr?.nombre)
    .filter(Boolean);
};

const mapProviderPlan = (rawPlan, travelers) => {
  const price = Number(
    rawPlan.PrecioUnitario || rawPlan.PrecioEmision || rawPlan.Price || rawPlan.price || rawPlan.PrecioNeto || 0
  );
  const currency = rawPlan.MonedaLista || rawPlan.Currency || rawPlan.currency || "USD";
  const totalTravelers = Number(travelers || rawPlan.CantidadPasajeros || rawPlan.Travelers || 1) || 1;

  return {
    id: rawPlan.IdProducto || rawPlan.PlanId || rawPlan.id || rawPlan.code || rawPlan.name,
    name: rawPlan.NombreProducto || rawPlan.Producto || rawPlan.PlanName || rawPlan.name || "Plan Universal Assistance",
    provider: "Universal Assistance",
    price,
    currency,
    coverage: rawPlan.AmbitoGeografico || rawPlan.FamiliaProducto || rawPlan.Coverage || rawPlan.coverage || "",
    duration: rawPlan.Categoria || rawPlan.Duration || rawPlan.duration || "",
    perks: extractPerks(rawPlan),
    description: rawPlan.Description || rawPlan.description || rawPlan.Producto || "",
    destination: rawPlan.Destino || rawPlan.Destination || rawPlan.destination,
    startDate: rawPlan.FechaInicio || rawPlan.StartDate || rawPlan.startDate,
    endDate: rawPlan.FechaFin || rawPlan.EndDate || rawPlan.endDate,
    travelers: totalTravelers,
    total: price * totalTravelers,
    raw: rawPlan,
  };
};

const getFallbackPlans = (searchParams) => {
  const travelers = Number(searchParams.travelers || 1);
  return mockPlans.map((plan) => ({
    ...plan,
    destination: searchParams.destination,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    travelers,
    total: plan.price * travelers,
  }));
};

const fetchProviderAvailability = async (searchParams) => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${PROVIDER_AVAIL_ENDPOINT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchParams),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`UA availability failed with status ${response.status}`);
  }

  const data = await response.json();
  if (Array.isArray(data?.plans)) return data.plans;
  if (Array.isArray(data?.parsed)) return data.parsed;
  if (Array.isArray(data)) return data;
  return [];
};

export const AssistanceService = {
  async getAvailability(searchParams = {}) {
    const { destination, startDate, endDate, travelers, age1, originCountry, tripType } = searchParams;

    try {
      const providerPlans = await fetchProviderAvailability({
        destination,
        startDate,
        endDate,
        travelers,
        age1,
        paisOrigen: originCountry,
        tipoViaje: tripType,
      });

      const mapped = providerPlans
        .map((plan) => mapProviderPlan(plan, travelers))
        .filter((plan) => plan && plan.id);

      if (mapped.length > 0) {
        return { plans: mapped };
      }
    } catch (error) {
      console.error("UA availability error", error);
    }

    return { plans: getFallbackPlans(searchParams) };
  },

  async getDetail(planId, searchParams = {}) {
    if (!planId) return null;

    const availability = await this.getAvailability(searchParams);
    const plan = availability.plans.find((item) => item.id === planId);
    if (!plan) return null;

    return {
      ...plan,
      inclusions: plan.perks && plan.perks.length > 0 ? plan.perks : toArray(plan.inclusions),
      exclusions:
        plan.exclusions && plan.exclusions.length > 0
          ? plan.exclusions
          : [
              "Enfermedades preexistentes no declaradas",
              "Deportes extremos",
              "Perdida por negligencia",
            ],
    };
  },
};
