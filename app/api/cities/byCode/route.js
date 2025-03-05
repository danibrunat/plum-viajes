import SanityService from "../../services/sanity.service";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const response = await SanityService.getFromSanity(
    `*[_type == "city" && iata_code == "${code}"]`
  );

  if (response?.error) Response.json(response?.error);

  return Response.json(response);
}
