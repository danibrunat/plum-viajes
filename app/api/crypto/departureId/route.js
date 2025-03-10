import CryptoService from "../../services/cypto.service";

export async function POST(req) {
  const body = await req.json();
  const { provider, departureFrom } = body;
  const cryptoDepartureId = CryptoService.generateDepartureId(
    provider,
    departureFrom
  );

  return Response.json({
    departureId: cryptoDepartureId,
  });
}
