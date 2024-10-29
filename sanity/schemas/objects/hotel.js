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
      title: "id",
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
      console.log("id", id);
      return {
        subtitle: `${id}: ${name}`,
      };
    },
  },
});
