import { groq } from "next-sanity";
import { getSiteBaseUrl, mapRoutesToSitemapEntries, buildFallbackSitemapEntry } from "./helpers/api/sitemapHelpers";
import { client } from "./lib/client";

const routesQuery = groq`*[
  _type == "route" &&
  !(_id in path("drafts.**")) &&
  includeInSitemap != false &&
  disallowRobots != true
]{
  "slug": slug.current,
  "lastModified": coalesce(page->_updatedAt, page->_createdAt, _updatedAt, _createdAt)
}`;

export default async function sitemap() {
  const baseUrl = getSiteBaseUrl();

  try {
    const routes = await client.fetch(routesQuery);
    const entries = mapRoutesToSitemapEntries(routes, baseUrl);

    if (entries.length > 0) {
      return entries;
    }

    return [buildFallbackSitemapEntry(baseUrl)];
  } catch (error) {
    console.error("[SITEMAP] Failed to build sitemap", error);
    return [buildFallbackSitemapEntry(baseUrl)];
  }
}
