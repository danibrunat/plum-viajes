import groq from "groq";
import { slugToAbsUrl } from "../../utils/urls";
import { client } from "../../sanity/lib/client";

export default async function handler(req, res) {
  const { allRoutesSlugs, baseUrl } = await client.fetch(groq`{
    "allRoutesSlugs": *[
      _type == "route" &&
      !(_id in path("drafts.**")) &&
      includeInSitemap != false &&
      disallowRobots != true
    ].slug.current,

    // And the base site URL
    "baseUrl": *[_id == "siteConfig"][0].url,
  }`);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allRoutesSlugs
      .map(
        (slug) => `
    <url>
      <loc>${slugToAbsUrl(slug, baseUrl)}</loc>
    </url>
    `
      )
      .join("\n")}
  </urlset>`;

  res?.status(200).send(sitemap);
}
