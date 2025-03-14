import XmlService from "../../../services/xml.service";

export async function POST(request) {
  const body = await request.json();
  try {
    const url = process.env.OLA_URL;
    const avail = await XmlService.soap.request(url, body, "GetPackagesFares");
    if (!Array.isArray(avail)) {
      const response = [avail];
      return Response.json(response);
    }
    return Response.json(avail);
  } catch (error) {
    return Response.json({ error: error.message });
  }
}
