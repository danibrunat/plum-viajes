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

  // Normalize and filter slugs to avoid accidental blocking of the root or empty paths
  const normalizedDisallowed = (disallowedRoutes || [])
    .map(({ slug }) => (typeof slug === "string" ? slug.trim() : ""))
    .filter(Boolean)
    .filter((slug) => slug !== "/");

  const disallowRules = normalizedDisallowed.map((slug) => ({
    userAgent: "*",
    disallow: slug.startsWith("/") ? slug : `/${slug}`,
  }));

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
