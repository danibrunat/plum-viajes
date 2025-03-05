import groq from "groq";
import { client } from "../../sanity/lib/client";

export async function GET(request) {
  const baseUrl = process.env.URL || "http://localhost:3000";

  const { allRoutes } = await client.fetch(groq`{
    "allRoutes": *[
      _type == "route" &&
      !(_id in path("drafts.**")) &&
      includeInSitemap != false &&
      disallowRobots != true
    ]{
      "slug": slug.current,
      _updatedAt
    }
  }`);

  const sitemapEntries = allRoutes?.map(({ slug, _updatedAt }) => {
    return {
      url: `${baseUrl}/${slug === "/" ? "" : slug}`,
      lastModified: _updatedAt || new Date(),
      changeFrequency: slug === "/" ? "weekly" : "monthly",
      priority: slug === "/" ? 1.0 : 0.8,
    };
  });

  const sitemapXml = generateSitemapXml(sitemapEntries);

  return new Response(sitemapXml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

function generateSitemapXml(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${entries
      .map(
        ({ url, lastModified, changeFrequency, priority }) => `
      <url>
        <loc>${url}</loc>
        <lastmod>${new Date(lastModified).toISOString()}</lastmod>
        <changefreq>${changeFrequency}</changefreq>
        <priority>${priority}</priority>
      </url>
    `
      )
      .join("")}
  </urlset>`;
}
