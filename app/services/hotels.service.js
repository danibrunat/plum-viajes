import { ApiUtils } from "../api/services/apiUtils.service";
import DatabaseService from "../api/services/sanity.service";
import { Api } from "./api.service";

const HotelsService = {
  getHotelData: async (provider, pkgHotel) => {
    console.log("pkgHotel", pkgHotel);
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
      const hotelsMatching =
        await DatabaseService.getByFieldIlikeAndCustomSelect(
          "hotels",
          "name",
          pkgHotel.name,
          `*, hotels_images (image_name)`
        );
      if (!hotelsMatching || hotelsMatching.length === 0) {
        throw new Error(`No se encontró mapeo para el hotel: ${pkgHotel.name}`);
      }
      // Tomamos el primer resultado (o aplicar otra lógica de selección si corresponde)
      const mappedHotel = hotelsMatching[0];
      // Asignamos el common hotel id obtenido al pkgHotel
      pkgHotel.id = mappedHotel.id;
      // Ahora se consulta el hotel usando el ID mapeado
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
