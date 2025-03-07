import { groq } from "next-sanity";
import SanityService from "../../services/sanity.service";

async function getPkgLandingData(destination) {
  const cityData = await SanityService.getFromSanity(
    groq`*[_type == "city" && (country_name match "*${destination}*" || region_name match "*${destination}*" || name match "*${destination}*")] {
      name,
      country_name,
      iata_code,
      region_name,
      "images": coalesce(images[].asset->url, [])
    }`
  );

  return cityData;
}

export async function POST(req) {
  const body = await req.json();
  const { product, destination } = body;
  switch (product) {
    case "packages":
      const response = await getPkgLandingData(destination);
      return Response.json(response);
    default:
      return Response.json({});
  }
}
