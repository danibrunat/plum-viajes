import { Airlines } from "../../services/airlines.service";
import { ApiUtils } from "../../services/apiUtils.service";

export async function GET(req, props) {
  const params = await props.params;
  const { airlineId } = params;
  const airlineArrResponse = await ApiUtils.requestHandler(
    Airlines.getByCode(airlineId),
    "airlines"
  );
  const airlineResponse = airlineArrResponse[0];

  return Response.json(airlineResponse);
}
