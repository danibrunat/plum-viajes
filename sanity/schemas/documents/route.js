import { LinkIcon } from "@sanity/icons";
import { defineField } from "sanity";

export default defineField({
  name: "route",
  type: "document",
  title: "Rutas",
  icon: LinkIcon,
  fields: [
    {
      name: "slug",
      type: "slug",
      title: "Slug",
    },
    {
      name: "page",
      type: "reference",
      description: "Select the page that this route should point to",
      to: [
        {
          type: "page",
        },
      ],
    },
    {
      title: "Ícono de la ruta",
      description: "Elegí el ícono que tendrá en el menú",
      name: "icon",
      type: "iconPicker",
      options: {
        providers: ["fa"],
        outputFormat: "react",
      },
    },
    {
      name: "includeInSitemap",
      type: "boolean",
      title: "Include page in sitemap",
      description: "For search engines. Will be added to /sitemap.xml",
    },
    {
      name: "disallowRobots",
      type: "boolean",
      title: "Disallow in robots.txt",
      description: "Hide this route for search engines",
    },
  ],
  preview: {
    select: {
      slug: "slug.current",
      pageTitle: "page.title",
    },
    prepare({ slug, pageTitle }) {
      return {
        title: slug === "/" ? "/" : `/${slug}`,
        subtitle: `Page: ${pageTitle}`,
      };
    },
  },
});
