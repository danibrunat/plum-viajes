import { Hotels } from "../../services/hotels.service";

export async function GET(req, { params }) {
  const { hotelId } = params;
  const baseHotelsResponse = await Hotels.getById(hotelId);
  const hotelImages = baseHotelsResponse?.hotels_images;

  // Asegúrate de que todas las promesas se resuelvan
  const hotelImagesWithPublicUrl = await Promise.all(
    hotelImages.map(async (image) => {
      const publicUrl = await Hotels.getImagePublicUrl(`${image.image_name}`);
      return { ...image, publicUrl }; // Incluir la URL pública en el objeto de imagen
    })
  );

  const response = {
    ...baseHotelsResponse,
    images: hotelImagesWithPublicUrl, // Ahora tienes las URLs públicas
  };

  return Response.json(response);
}
