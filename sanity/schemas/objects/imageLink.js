import { defineField } from "sanity";

export default defineField({
  type: "object",
  name: "imageLink",
  title: "Un link con imagen",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Título",
    },
    {
      name: "link",
      type: "string",
      title: "Link",
    },
    {
      name: "image",
      type: "image",
      title: "Imagen",
      options: {
        hotspot: true,
      },
    },
  ],
});
