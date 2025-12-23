import { AssistanceService } from "../../services/assistance/index.js";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get("destination") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const travelers = searchParams.get("travelers") || "1";

  const result = await AssistanceService.getAvailability({
    destination,
    startDate,
    endDate,
    travelers,
  });

  return Response.json(result);
}
