import { defineField } from "sanity";

export default defineField({
  type: "object",
  name: "searchEngines",
  title: "Motores de Búsqueda",
  fields: [
    {
      name: "packages",
      type: "boolean",
      title: "Buscador de paquetes",
    },
    {
      name: "assurances",
      type: "boolean",
      title: "Asistencia al viajero",
    },
    {
      name: "flights",
      type: "boolean",
      title: "Buscador de Vuelos",
    },
    {
      name: "hotels",
      type: "boolean",
      title: "Buscador de Hoteles",
    },
  ],
  preview: {
    select: {
      packages: "packages",
      assurances: "assurances",
      flights: "flights",
      hotels: "hotels",
    },
    prepare({ packages, assurances, flights, hotels }) {
      const activeEngines = [];
      if (packages) activeEngines.push("Paquetes");
      if (assurances) activeEngines.push("Asistencia");
      if (flights) activeEngines.push("Vuelos");
      if (hotels) activeEngines.push("Hoteles");

      return {
        title: "Motores de Búsqueda",
        subtitle: activeEngines.length
          ? `Activos: ${activeEngines.join(", ")}`
          : "Ningún motor activado",
      };
    },
  },
});
