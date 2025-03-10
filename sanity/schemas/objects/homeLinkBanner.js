import { defineField } from "sanity";

export default defineField({
  type: "object",
  name: "homeLinksBanners",
  title: "Banner con Links",
  fields: [
    {
      name: "content",
      type: "array",
      title: "Secciones de la página",
      of: [{ type: "imageLink" }],
    },
  ],
  preview: {
    select: {
      content: "content",
      previewImage: "content.0.image", // Imagen del primer banner
    },
    prepare({ content, previewImage }) {
      // Verificar que content sea un array y tenga elementos
      const items = Array.isArray(content) ? content : [];

      // Extraer títulos de cada banner, si existen, y filtrar valores nulos o vacíos
      const titles = items.map((item) => item?.title).filter(Boolean);
      const titleText = titles.length ? titles.join(", ") : "Sin títulos";

      // Contar el número de banners
      const count = items.length;

      return {
        title: "Banners con Links",
        media: previewImage || undefined, // Mostrar imagen del primer banner si existe
      };
    },
  },
});
