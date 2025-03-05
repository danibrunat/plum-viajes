import SanityService from "../../services/sanity.service";

async function getPkgLandingData(destination) {
  const citiesQueryArr = `country_name matches "${destination}" || region_name matches "${destination}" || name matches "${destination}"`;

  const cityData = await SanityService.getFromSanity(
    `*[_type == "city" && (${citiesQueryArr})] {
      name,
      country_name,
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
