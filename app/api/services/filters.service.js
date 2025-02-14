import { ApiUtils } from "./apiUtils.service";

export const Filters = {
  config: [
    {
      id: "mealPlan",
      title: "Régimen de Comidas",
      type: "checkbox",
      grouper: "departures[].hotels[].mealPlan", // Actualizado
    },
    {
      id: "night",
      title: "Cantidad de Noches",
      type: "checkbox",
      grouper: "nights", // Ruta directa en el paquete
    },
    {
      id: "rating",
      title: "Estrellas",
      type: "checkbox",
      grouper: "departures[].hotels[].rating", // Actualizado
    },
    {
      id: "hotel",
      title: "Alojamiento",
      type: "checkbox",
      grouper: "departures[].hotels[].name", // Actualizado
    },
  ],

  // Método que procesa la respuesta de availability
  process: async (pkgAvailabilityResponse) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/filters`, {
      headers: ApiUtils.getCommonHeaders(),
      method: "POST",
      body: JSON.stringify({ availability: pkgAvailabilityResponse }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch filters");
    }
    return res.json();
  },
};
