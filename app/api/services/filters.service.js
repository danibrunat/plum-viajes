import { ApiUtils } from "./apiUtils.service";

export const Filters = {
  config: [
    {
      id: "mealPlan",
      title: "Régimen de Comidas",
      type: "checkbox",
      grouper: "hotels[].mealPlan", // Ruta dentro de la respuesta para agrupar los datos
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
      grouper: "hotels[].rating", // Valor dentro de cada hotel
    },
    {
      id: "hotel",
      title: "Alojamiento",
      type: "checkbox",
      grouper: "hotels[].name", // Nombre del hotel
    },
  ],

  // Método que procesa la respuesta de availability
  process: async (pkgAvailabilityResponse) => {
    // Hacemos la petición a la API para procesar los filtros (si es necesario)
    const res = await fetch(`${process.env.URL}/api/filters`, {
      headers: ApiUtils.getCommonHeaders(),
      method: "POST",
      body: JSON.stringify({ availability: pkgAvailabilityResponse }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch filters");
    }

    // Retornamos los filtros procesados
    return res.json();
  },
};
