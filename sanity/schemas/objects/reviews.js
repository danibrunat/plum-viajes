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
  preview: {
    select: {
      image: "image", // Seleccionamos la imagen de opiniones
    },
    prepare({ image }) {
      return {
        title: "Opiniones de usuarios",
        subtitle: image ? "Imagen cargada" : "Sin imagen cargada",
        media: image || undefined, // Mostrar la imagen si está disponible
      };
    },
  },
});
