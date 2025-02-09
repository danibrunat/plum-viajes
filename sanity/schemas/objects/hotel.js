import { defineField } from "sanity";

export default defineField({
  type: "object",
  name: "hotel",
  title: "Hoteles",
  description: "Seleccioná los hoteles que tendrá el paquete.",
  fields: [
    {
      name: "id",
      type: "number",
      title: "ID",
    },
    {
      name: "name",
      type: "string",
      title: "Hotel",
    },
  ],
  preview: {
    select: {
      id: "id",
      name: "name",
    },
    prepare({ id, name }) {
      const title = name || "Sin nombre";
      const subtitle = id !== undefined ? `ID: ${id}` : "ID no definido";
      return {
        title,
        subtitle,
      };
    },
  },
});
