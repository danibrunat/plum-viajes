import { ApiUtils } from "../api/services/apiUtils.service";
import { Api } from "./api.service";

const HotelsService = {
  getHotelsData: async (provider, pkgHotels) => {
    // TODO: Debería hacer un mapeo previo para obtener el ID del hotel correcto dependiendo del operador.
    // Debemos tener una tabla de mapeos de operadores y hoteles. Ej: OLA: ABC123 = 1, PLUM: 123 = 1. Siendo este el mismo hotel.
    if (provider === "plum") {
      // TODO: Debemos también soportar que venga un array de hotels. Por ahora dejamos pkgHotels como nombre de la variable pero vendrá solo un objeto. DEbemos agregar la poibildiad del array desde provider.service
      const hotelDataRequest = Array.isArray(pkgHotels)
        ? await Promise.all(
            pkgHotels.map(
              async (h) =>
                await ApiUtils.requestHandler(
                  fetch(
                    Api.hotels.getById.url(h.id),
                    Api.hotels.getById.options()
                  ),
                  Api.hotels.getById.name
                )
            )
          )
        : await ApiUtils.requestHandler(
            fetch(
              Api.hotels.getById.url(pkgHotels.id),
              Api.hotels.getById.options()
            ),
            Api.hotels.getById.name
          );
      const hotelDataResponse = await hotelDataRequest.json();
      return [hotelDataResponse];
    }
  },
};

export default HotelsService;
