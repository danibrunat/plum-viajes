import { defineField } from "sanity";

export default defineField({
  type: "object",
  name: "reviews",
  title: "Imagen con las opiniones de tus usuarios",
  fields: [
    {
      name: "image",
      type: "image",
      title: "Opiniones",
      options: {
        hotspot: true,
      },
    },
  ],
});
