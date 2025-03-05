import { ApiUtils } from "../api/services/apiUtils.service";
import SanityService from "../api/services/sanity.service";
import { capitalizeFirstLetter, sanitizeHtmlString } from "../helpers/strings";
import { Api } from "./api.service";

const HotelsService = {
  getHotelData: async (provider, pkgHotel, destination) => {
    if (provider === "plum") {
      // Para PLUM se utiliza el ID que ya viene en pkgHotel
      const hotelDataRequest = await ApiUtils.requestHandler(
        fetch(
          Api.hotels.getById.url(pkgHotel.id),
          Api.hotels.getById.options()
        ),
        Api.hotels.getById.name
      );
      const hotelDataResponse = await hotelDataRequest.json();

      return hotelDataResponse;
    } else if (provider === "ola") {
      // Para OLA, se busca por nombre (usando ilike) para obtener el common hotel id
      const hotelsRequest = await ApiUtils.requestHandler(
        fetch(
          Api.hotels.getByName.url(pkgHotel.name),
          Api.hotels.getByName.options()
        ),
        Api.hotels.getByName.name
      );
      const hotelsMatching = await hotelsRequest.json();
      if (!hotelsMatching || hotelsMatching.length === 0) {
        // pkgHotel debe contener: name, stars, description, latitude, longitude y city (con _id)

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
              _ref: cityId, // Asegúrate de tener el ID del documento city
            },
          };
          // No se encontró el hotel; lo insertamos.
          const insertedHotel = await SanityService.createObject(newHotel);

          // Si lo inserta, lo vamos a buscar a la Api para normalizar la respuesta hacia el consumidor
          if (insertedHotel) {
            const hotelDataRequest = await ApiUtils.requestHandler(
              fetch(
                Api.hotels.getById.url(insertedHotel._id),
                Api.hotels.getById.options()
              ),
              Api.hotels.getById.name
            );
            const hotelDataResponse = await hotelDataRequest.json();
            return hotelDataResponse;
          }

          throw new Error("Cannot handle hotel");
        } catch (error) {
          console.error(error);
        }
      }
      // Asignamos el common hotel id obtenido al pkgHotel
      return hotelsMatching[0];
    }
  },
};

export default HotelsService;
