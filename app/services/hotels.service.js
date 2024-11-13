import { ApiUtils } from "../api/services/apiUtils.service";
import { Api } from "./api.service";

const HotelsService = {
  getHotelData: async (provider, pkgHotel) => {
    // TODO: Debería hacer un mapeo previo para obtener el ID del hotel correcto dependiendo del operador.
    // Debemos tener una tabla de mapeos de operadores y hoteles. Ej: OLA: ABC123 = 1, PLUM: 123 = 1. Siendo este el mismo hotel.
    if (provider === "plum" || provider === "ola") {
      if (provider === "ola") pkgHotel.id = 2;
      // TODO: Debemos también soportar que venga un array de hotels. Por ahora dejamos pkgHotels como nombre de la variable pero vendrá solo un objeto. DEbemos agregar la poibildiad del array desde provider.service
      const hotelDataRequest = await ApiUtils.requestHandler(
        fetch(
          Api.hotels.getById.url(pkgHotel.id),
          Api.hotels.getById.options()
        ),
        Api.hotels.getById.name
      );
      const hotelDataResponse = await hotelDataRequest.json();
      return hotelDataResponse;
    }
  },
};

export default HotelsService;
