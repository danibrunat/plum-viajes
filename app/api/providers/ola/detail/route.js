import XmlService from "../../../services/xml.service";

export async function POST(request) {
  const body = await request.json();
  try {
    const url = process.env.OLA_URL;
    const detail = await XmlService.soap.request(url, body, "GetPackagesFares");
    return new Response(JSON.stringify(detail), {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate" }, // Configuración del caché
    });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
