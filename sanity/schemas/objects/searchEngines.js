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
});
