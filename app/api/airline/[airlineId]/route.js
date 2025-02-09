import { Airlines } from "../../services/airlines.service";
import { ApiUtils } from "../../services/apiUtils.service";

export async function GET(req, { params }) {
  const { airlineId } = params;
  const airlineArrResponse = await ApiUtils.requestHandler(
    Airlines.getByAirlineCode(airlineId),
    "airlines"
  );
  const airlineResponse = airlineArrResponse[0];

  const logoPublicUrl =
    (airlineResponse?.logo_url &&
      (await Airlines.getLogoPublicUrl(airlineResponse.logo_url))) ||
    "";

  const response = { ...airlineResponse, logoUrl: logoPublicUrl };

  return Response.json(response);
}
