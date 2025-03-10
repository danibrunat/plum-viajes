import { defineField } from "sanity";

export default defineField({
  name: "slider",
  type: "object",
  title: "Slider de imágenes",
  fields: [
    {
      name: "items",
      type: "array",
      title: "Imágenes",
      of: [
        {
          name: "image",
          type: "image",
          title: "Imagen",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Texto alternativo",
            },
          ],
        },
      ],
      options: {
        layout: "grid",
      },
    },
    {
      name: "display",
      type: "string",
      title: "Visualización",
      description: "¿Cómo se deben mostrar estas imágenes?",
      options: {
        list: [{ title: "Carrusel", value: "carousel" }],
        layout: "radio", // Cambia la selección a botones de radio
      },
    },
    {
      name: "zoom",
      type: "boolean",
      title: "Zoom habilitado",
      description: "¿Se debe habilitar el zoom en las imágenes?",
    },
  ],
  preview: {
    select: {
      images: "items", // Seleccionamos el array de imágenes
      firstImage: "items.0", // Seleccionamos la primera imagen
      display: "display", // Seleccionamos la opción de visualización
      zoom: "zoom", // Seleccionamos la opción de zoom
    },
    prepare({ images, firstImage, display, zoom }) {
      // Validar si hay imágenes
      const imageCount = Array.isArray(images) ? images.length : 0;
      const altText = firstImage?.alt || "Sin texto alternativo";
      const displayType = display === "carousel" ? "Carrusel" : "Desconocido";
      const zoomText = zoom ? "Zoom habilitado" : "Zoom deshabilitado";

      return {
        title: `Slider de portada`,
        subtitle: `Visualización: ${displayType}, ${zoomText}, Texto alt: ${altText}`,
        media: firstImage, // Muestra la primera imagen como preview
      };
    },
  },
});
