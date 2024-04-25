import { defineField } from "sanity";

export default defineField({
  type: "object",
  name: "products",
  title: "Productos",
  fields: [
    {
      name: "label",
      type: "string",
      title: "Descripción",
      options: {
        list: [
          { title: "Paquetes", value: "pkg" },
          { title: "Vuelos", value: "air" },
          { title: "Hoteles", value: "htl" },
          { title: "Asistencia al Viajero", value: "ins" },
          { title: "Cruceros", value: "cru" },
          { title: "Autos", value: "car" },
        ],
      },
    },
  ],
  preview: {
    select: {
      label: "label",
    },
    prepare({ label }) {
      return {
        title: `${label}`,
      };
    },
  },
});
