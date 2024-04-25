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
      let title = "";
      Object.keys(content).map((item) => {
        title = title + content[item]?.title + ", ";
      });
      return {
        title: `Items: ${title}`,
        subtitle: `Agregados ${Object.keys(content).length} banners`,
        media: previewImage,
      };
    },
  },
});
