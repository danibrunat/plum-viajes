import { ApiUtils } from "../api/services/apiUtils.service";
import { Api } from "./api.service";

const AirlinesService = {
  async getAirlineData(code) {
    const airlineDataRequest = await ApiUtils.requestHandler(
      fetch(Api.airlines.getById.url(code), Api.airlines.getById.options()),
      Api.airlines.getById.name
    );
    return airlineDataRequest.json();
  },
};

export default AirlinesService;
