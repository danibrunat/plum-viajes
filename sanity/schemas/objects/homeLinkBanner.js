import { defineField } from "sanity";

export default defineField({
  type: "object",
  name: "homeLinksBanners",
  title: "Banner con Links",
  fields: [
    {
      name: "content",
      type: "array",
      title: "Page sections",
      of: [{ type: "imageLink" }],
    },
  ],
  preview: {
    select: {
      content: "content",
      previewImage: "content.0.image",
    },
    prepare({ content, previewImage }) {
      // Validar que content sea un array
      const items = Array.isArray(content) ? content : [];
      // Extraer títulos de cada banner y filtrar valores nulos o vacíos
      const titles = items.map((item) => item?.title).filter(Boolean);
      const titleText = titles.length ? titles.join(", ") : "Sin títulos";
      const count = items.length;

      return {
        title: `Banners: ${titleText}`,
        subtitle: `Agregados ${count} banner${count === 1 ? "" : "s"}`,
        media: previewImage,
      };
    },
  },
});
