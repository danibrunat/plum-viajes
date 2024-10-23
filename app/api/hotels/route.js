import { Hotels } from "../services/hotels.service";

export async function GET(request) {
  const response = await Hotels.get();
  return Response.json(response);
}
