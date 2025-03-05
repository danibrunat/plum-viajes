import SanityService from "../services/sanity.service";

export async function GET(req) {
  const response = await SanityService.getFromSanity(" *[_type == 'city'] ");

  if (response?.error) return Response.json(response?.error);

  return Response.json(response);
}
