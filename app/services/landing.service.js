import { ApiUtils } from "../api/services/apiUtils.service";
import { Api } from "../services/api.service";

export const LandingService = {
  destination: {
    get: async (body) => {
      const landingDestinationRequest = await ApiUtils.requestHandler(
        fetch(
          Api.landing.destination.getData.url(),
          Api.landing.destination.getData.options(body)
        ),
        Api.landing.destination.getData.name
      );
      const landingDestinationResponse = await landingDestinationRequest.json();
      return landingDestinationResponse;
    },
  },
};
