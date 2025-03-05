import { ApiUtils } from "../../services/apiUtils.service";
import { Hotels } from "../../services/hotels.service";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const response = await ApiUtils.requestHandler(Hotels.getByNameIlike(name));
  return Response.json(response);
}
