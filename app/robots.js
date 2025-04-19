import { groq } from "next-sanity";
import { client } from "./lib/client";

export default async function robots() {
  // Fetch all routes that have disallowRobots set to true
  const { disallowedRoutes } = await client.fetch(groq`{
    "disallowedRoutes": *[
      _type == "route" &&
      !(_id in path("drafts.**")) &&
      disallowRobots == true
    ]{
      "slug": slug.current
    }
  }`);

  // Create disallow rules for routes that should be hidden from robots
  const disallowRules =
    disallowedRoutes?.map((route) => ({
      userAgent: "*",
      disallow: `/${route.slug === "/" ? "" : route.slug}`,
    })) || [];

  // Add default allow rule
  const rules = [
    {
      userAgent: "*",
      allow: "/",
    },
    ...disallowRules,
  ];

  return {
    rules,
    sitemap: `${process.env.NEXT_PUBLIC_URL || "https://plumviajes.com.ar"}/sitemap.xml`,
  };
}
