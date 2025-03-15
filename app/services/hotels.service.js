import { ApiUtils } from "../api/services/apiUtils.service";
import SanityService from "../api/services/sanity.service";
import { capitalizeFirstLetter, sanitizeHtmlString } from "../helpers/strings";
import { Api } from "./api.service";

const HotelsService = {
  async getHotelData(provider, pkgHotel, destination) {
    if (provider === "plum") {
      const hotelDataRequest = await ApiUtils.requestHandler(
        fetch(
          Api.hotels.getById.url(pkgHotel.id),
          Api.hotels.getById.options()
        ),
        Api.hotels.getById.name
      );
      return await hotelDataRequest.json();
    } else if (provider === "ola") {
      const hotelsRequest = await ApiUtils.requestHandler(
        fetch(
          Api.hotels.getByName.url(pkgHotel.name),
          Api.hotels.getByName.options()
        ),
        Api.hotels.getByName.name
      );
      const hotelsMatching = await hotelsRequest.json();

      if (!hotelsMatching || hotelsMatching.length === 0) {
        try {
          const cityIdRequest = await ApiUtils.requestHandler(
            fetch(
              Api.cities.getByCode.url(destination),
              Api.cities.getByCode.options()
            ),
            "Fetch Cities"
          );
          const cityIdResponse = await cityIdRequest.json();
          const cityId = cityIdResponse[0]._id;

          const newHotel = {
            _type: "hotel",
            name: capitalizeFirstLetter(pkgHotel.name),
            stars: Number(pkgHotel.rating),
            description: sanitizeHtmlString(pkgHotel.description),
            latitude: Number(pkgHotel?.latitude) || 0,
            longitude: Number(pkgHotel?.longitude) || 0,
            images: [],
            city_id: {
              _type: "reference",
              _ref: cityId,
            },
          };

          const insertedHotel = await SanityService.createObject(newHotel);

          if (insertedHotel) {
            const hotelDataRequest = await ApiUtils.requestHandler(
              fetch(
                Api.hotels.getById.url(insertedHotel._id),
                Api.hotels.getById.options()
              ),
              Api.hotels.getById.name
            );
            return await hotelDataRequest.json();
          }

          throw new Error("Cannot handle hotel");
        } catch (error) {
          console.error(error);
        }
      }
      return hotelsMatching[0];
    }
  },
};

export default HotelsService;
