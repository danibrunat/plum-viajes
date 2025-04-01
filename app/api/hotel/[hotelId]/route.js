import { Hotels } from "../../services/hotels.service";

export async function GET(req, props) {
  const params = await props.params;
  const { hotelId } = params;
  const baseHotelsResponse = await Hotels.getById(hotelId);

  return Response.json(baseHotelsResponse[0]);
}
