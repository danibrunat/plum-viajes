import { MasterDetailIcon } from "@sanity/icons";
import { defineField } from "sanity";

export default defineField({
  name: "page",
  type: "document",
  title: "Páginas",
  icon: MasterDetailIcon,
  fieldsets: [
    {
      title: "SEO & metadata",
      name: "metadata",
    },
  ],
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "content",
      type: "array",
      title: "Page sections",
      of: [
        { type: "hero" },
        { type: "slider" },
        { type: "homeLinksBanners" },
        { type: "searchEngines" },
        { type: "reviews" },
        { type: "imageSection" },
        { type: "textSection" },
        { type: "iFrame" },
        {
          type: "object", // Sección para paquetes taggeados
          name: "taggedPackages",
          title: "Tags de paquetes",
          fields: [
            {
              name: "tag",
              type: "reference",
              title: "Tag", // Solo un tag en lugar de un array
              to: [{ type: "tag" }], // Referencia a un documento del tipo 'tag'
            },
          ],
          preview: {
            select: {
              title: "title",
              content: "content",
              media: "openGraphImage",
            },
            prepare({ title, content, media }) {
              const count = Array.isArray(content) ? content.length : 0;
              const firstSection =
                count > 0 && content[0] ? content[0]._type : null;
              const subtitle =
                count > 0
                  ? `${count} sección${count > 1 ? "es" : ""} – Primera: ${firstSection}`
                  : "Sin secciones definidas";

              return {
                title: title || "Sin título",
                subtitle,
                media,
              };
            },
          },
        },
      ],
    },
    {
      name: "description",
      type: "text",
      title: "Description",
      description: "This description populates meta-tags on the webpage",
      fieldset: "metadata",
    },
    {
      name: "openGraphImage",
      type: "image",
      title: "Open Graph Image",
      description: "Image for sharing previews on Facebook, Twitter etc.",
      fieldset: "metadata",
    },
  ],

  preview: {
    select: {
      title: "title",
      media: "openGraphImage",
    },
  },
});
