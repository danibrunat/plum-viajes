import { Hotels } from "../../services/hotels.service";

export async function GET(req, { params }) {
  const { hotelId } = params;
  const response = await Hotels.getById(hotelId);
  return Response.json(response);
}
