import XmlService from "../../../services/xml.service";

export async function POST(request) {
  const body = await request.json();
  try {
    const url = process.env.OLA_URL;
    const detail = await XmlService.soap.request(url, body, "GetPackagesFares");
    if (!Array.isArray(detail)) {
      const response = [detail];
      return Response.json(response);
    }
    return Response.json(detail);
  } catch (error) {
    return new Response.json(error, { status: 500 });
  }
}
