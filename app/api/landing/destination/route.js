import DatabaseService from "../../services/database.service";

async function getPkgLandingData(destination) {
  const citiesQueryArr = `country_name.ilike.${destination}, region_name.ilike.${destination}`;

  const destinationData =
    await DatabaseService.getAllByFieldEqualOrAndCustomSelect(
      "cities",
      "*, cities_images (image_name)",
      citiesQueryArr
    );

  return destinationData;
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
