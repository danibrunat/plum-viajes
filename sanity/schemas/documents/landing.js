import { LinkIcon } from "@sanity/icons";
import { defineField } from "sanity";

export default defineField({
  name: "landing",
  type: "document",
  title: "Landing por destino",
  icon: LinkIcon,
  fieldsets: [
    {
      title: "SEO & metadata",
      name: "metadata",
    },
  ],
  fields: [
    {
      name: "product",
      type: "string",
      description: "Indicá a qué producto pertenece la landing",
      options: {
        list: [
          { title: "Paquetes", id: "pkg", value: "packages" },
          { title: "Vuelos", id: "air", value: "flights" },
          { title: "Hoteles", id: "htl", value: "hotels" },
          { title: "Asistencia al Viajero", id: "ins", value: "insurances" },
          { title: "Cruceros", id: "cru", value: "cruzes" },
          { title: "Autos", id: "car", value: "cars" },
        ],
      },
    },
    {
      name: "type",
      type: "string",
      description: "Indicá de qué tipo configuramos la landing",
      options: {
        list: [
          { title: "Por país", id: "country", value: "country" },
          { title: "Por región", id: "region", value: "region" },
        ],
      },
    },
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "destination",
      type: "slug",
      title: "Destino",
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
      slug: "destination.current",
      type: "type",
      product: "product",
      pageTitle: "page.title",
    },
    prepare({ slug, product, pageTitle, type = "country" }) {
      return {
        title:
          slug === "/"
            ? "/"
            : `/landing/by-${type}/${product && product + "/"}${slug}`,
        subtitle: `Landing con destino a ${slug}`,
      };
    },
  },
});
