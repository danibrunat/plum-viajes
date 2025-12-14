import { getSiteBaseUrl } from "../helpers/api/sitemap";

export async function GET() {
  const baseUrl = getSiteBaseUrl();
  return Response.redirect(`${baseUrl}/sitemap.xml`, 308);
}
