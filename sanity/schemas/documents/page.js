import { MasterDetailIcon } from "@sanity/icons";
import { FaTags } from "react-icons/fa";
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
      title: "Secciones de la página",
      of: [
        //  { type: "hero" },
        { type: "slider" },
        { type: "homeLinksBanners" },
        { type: "searchEngines" },
        { type: "reviews" },
        //  { type: "imageSection" },
        //  { type: "textSection" },
        //  { type: "iFrame" },
        {
          type: "object", // Sección para paquetes taggeados
          name: "taggedPackages",
          title: "Paquetes por Tag",
          fields: [
            {
              name: "tag",
              type: "reference",
              title: "Tag", // Referencia a un solo tag
              to: [{ type: "tag" }], // Documento de tipo 'tag'
              validation: (Rule) =>
                Rule.required().error("El campo 'Tag' es obligatorio."),
            },
          ],
          preview: {
            select: {
              title: "tag.name", // Asigna el nombre del tag como título
            },
            prepare({ title }) {
              return {
                title: title || "Sin tag asignado",
                subtitle: "Sección de paquetes por tag",
                media: FaTags, // Icono opcional para la vista previa
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
