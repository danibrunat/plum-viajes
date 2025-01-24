import groq from "groq";
import { client } from "../sanity/lib/client";

export default async function sitem(req, res) {
  const baseUrl = "http://localhost:3000/";
  const { allRoutesSlugs } = await client.fetch(groq`{
    "allRoutesSlugs": *[
      _type == "route" &&
      !(_id in path("drafts.**")) &&
      includeInSitemap != false &&
      disallowRobots != true
    ].slug.current
  }`);

  return allRoutesSlugs?.map((route, i) => ({
    url: baseUrl + route,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: i,
  }));
}
