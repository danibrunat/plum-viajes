"use cache";
import SanityService from "../../services/sanity.service";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const sanityResponse = await SanityService.getFromSanity(
    `*[_type == "city" && name match "*${name}*"]`
  );

  if (sanityResponse?.error) Response.json(sanityResponse?.error);

  return Response.json(sanityResponse);
}
