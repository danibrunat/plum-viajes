import { Hotels } from "../services/hotels.service";

export async function GET(request) {
  const response = await Hotels.get();
  console.log("response", response);
  return Response.json(response);
}
