import { Airlines } from "../services/airlines.service";

export async function GET(request) {
  const response = await Airlines.get();
  return Response.json(response);
}
