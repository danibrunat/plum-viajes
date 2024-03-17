import bcp47 from "bcp47";
import { defineField } from "sanity";

export default defineField({
  name: "siteConfig",
  type: "document",
  title: "Site configuration",
  // https://www.sanity.io/docs/experimental/ui-affordances-for-actions
  __experimental_actions: [/* "create", "delete", */ "update", "publish"],
  fieldsets: [{ name: "footer", title: "Footer" }],
  fields: [
    {
      name: "title",
      type: "string",
      title: "Site title",
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
      description: "Choose page to be the frontpage",
      to: { type: "page" },
    },

    {
      title: "Brand logo",
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
          options: {
            isHighlighted: true,
          },
        },
      ],
    },
    {
      title: "Main navigation",
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
          options: {
            isHighlighted: true,
          },
        },
      ],
    },
    {
      title: "Footer navigation items",
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
