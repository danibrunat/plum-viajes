import { slugToAbsUrl } from "../../../utils/urls";

const DEFAULT_BASE_URL = "https://plumviajes.com.ar";
const HOME_CHANGE_FREQUENCY = "weekly";
const PAGE_CHANGE_FREQUENCY = "monthly";

export function getSiteBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_URL?.trim();
  if (!envUrl) return DEFAULT_BASE_URL;
  return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
}

export function mapRoutesToSitemapEntries(routes, baseUrl) {
  if (!routes?.length) return [];

  return routes.map(({ slug, lastModified }) => {
    const normalizedSlug = slug === "/" ? "" : slug;
    return {
      url: slugToAbsUrl(normalizedSlug, baseUrl),
      lastModified: coerceDate(lastModified),
      changeFrequency: normalizedSlug ? PAGE_CHANGE_FREQUENCY : HOME_CHANGE_FREQUENCY,
      priority: normalizedSlug ? 0.8 : 1,
    };
  });
}

export function buildFallbackSitemapEntry(baseUrl) {
  return {
    url: slugToAbsUrl("", baseUrl),
    lastModified: new Date(),
    changeFrequency: HOME_CHANGE_FREQUENCY,
    priority: 1,
  };
}

function coerceDate(value) {
  const parsedDate = value ? new Date(value) : new Date();
  return Number.isNaN(parsedDate.valueOf()) ? new Date() : parsedDate;
}
