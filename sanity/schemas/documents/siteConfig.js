import { defineField } from "sanity";

export default defineField({
  name: "siteConfig",
  type: "document",
  title: "Configuración del Sitio",
  // https://www.sanity.io/docs/experimental/ui-affordances-for-actions
  fieldsets: [{ name: "footer", title: "Footer" }],
  fields: [
    {
      name: "title",
      type: "string",
      title: "Título del sitio",
    },
    {
      title: "URL",
      name: "url",
      type: "url",
      description: "The main site url. Used to create canonical url",
    },
    {
      name: "frontpage",
      type: "reference",
      description: "Elegí una página de inicio",
      to: { type: "page" },
    },

    {
      title: "Logo",
      description:
        "Best choice is to use an SVG where the color are set with currentColor",
      name: "logo",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
        },
      ],
    },
    {
      title: "Navegación principal",
      name: "mainNavigation",
      description: "Select pages for the top menu",
      validation: (Rule) => [
        Rule.max(5).warning("Are you sure you want more than 5 items?"),
        Rule.unique().error("You have duplicate menu items"),
      ],
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "route" }],
        },
      ],
    },
    {
      title: "Botón contactanos",
      description:
        "Una imagen para el botón contactanos, no muy grande. Máximo 150 x 100.",
      name: "contact",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
        },
      ],
    },
    {
      title: "Navegación del Footer",
      name: "footerNavigation",
      type: "array",
      validation: (Rule) => [
        Rule.max(10).warning("Are you sure you want more than 10 items?"),
        Rule.unique().error("You have duplicate menu items"),
      ],
      fieldset: "footer",
      of: [
        {
          type: "reference",
          to: [{ type: "route" }],
        },
      ],
    },
    {
      name: "footerText",
      type: "simplePortableText",
      fieldset: "footer",
    },
  ],
});
