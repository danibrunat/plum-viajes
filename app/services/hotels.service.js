import { ApiUtils } from "../api/services/apiUtils.service";
import { Api } from "./api.service";

const HotelsService = {
  getHotelData: async (provider, pkgHotel) => {
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
        throw new Error(`No se encontró mapeo para el hotel: ${pkgHotel.name}`);
      }
      // Asignamos el common hotel id obtenido al pkgHotel
      return hotelsMatching[0];
    }
  },
};

export default HotelsService;
