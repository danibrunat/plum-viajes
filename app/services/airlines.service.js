import { ApiUtils } from "../api/services/apiUtils.service";
import { Api } from "./api.service";

const AirlinesService = {
  getAirlineData: async (code) => {
    const airlineDataRequest = await ApiUtils.requestHandler(
      fetch(Api.airlines.getById.url(code), Api.airlines.getById.options()),
      Api.airlines.getById.name
    );
    const airlineDataResponse = await airlineDataRequest.json();

    return airlineDataResponse;
  },
};

export default AirlinesService;
