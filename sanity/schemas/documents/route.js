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
      includeInSitemap: "includeInSitemap",
      disallowRobots: "disallowRobots",
      icon: "icon",
    },
    prepare({ slug, pageTitle, includeInSitemap, disallowRobots, icon }) {
      // Arma el estado SEO de la ruta
      const status = [];
      if (includeInSitemap === false) {
        status.push("No en Sitemap");
      }
      if (disallowRobots === true) {
        status.push("Bloqueado en Robots.txt");
      }
      return {
        title: slug === "/" ? "/" : `/${slug}`,
        subtitle: `${pageTitle ? "Page: " + pageTitle : "Sin página asignada"}${
          status.length ? " — " + status.join(" | ") : ""
        }`,
        media: icon || LinkIcon,
      };
    },
  },
});
