import { Hotels } from "../../services/hotels.service";

export async function GET(req, { params }) {
  const { hotelId } = params;
  const baseHotelsResponse = await Hotels.getById(hotelId);
  const hotelImagesWithPublicUrl = await Hotels.getImagesForHotel(hotelId);
  const response = {
    ...baseHotelsResponse,
    images: hotelImagesWithPublicUrl, // Ahora tienes las URLs públicas
  };

  return Response.json(response);
}
