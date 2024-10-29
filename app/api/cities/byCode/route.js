import { CitiesService } from "../../../services/cities.service";
import DatabaseService from "../../services/database.service";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  //console.log("name", name);

  const baseCityResponse =
    await DatabaseService.getAllByFieldEqualAndCustomSelect(
      "cities",
      `*, cities_images (image_name)`,
      "iata_code",
      code
    );
  const cityImages = baseCityResponse[0]?.cities_images;

  const citiesImagesWithPublicUrl = await Promise.all(
    cityImages.map(async (image) => {
      const publicUrl = await CitiesService.getImagePublicUrl(
        `${image.image_name}`
      );
      return { ...image, publicUrl }; // Incluir la URL pública en el objeto de imagen
    })
  );
  const response = [
    { ...baseCityResponse[0], images: citiesImagesWithPublicUrl },
  ];
  if (response?.error) Response.json(response?.error);

  return Response.json(response);
}
