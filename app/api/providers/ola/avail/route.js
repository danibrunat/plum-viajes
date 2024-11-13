import XmlService from "../../../services/xml.service";

export async function POST(request) {
  const body = await request.json();
  try {
    const url = process.env.OLA_URL;
    const avail = await XmlService.soap.request(url, body, "GetPackagesFares");
    return Response.json(avail);
  } catch (error) {
    return Response.json(error);
  }
}
