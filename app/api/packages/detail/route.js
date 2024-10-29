import { Api } from "../../../services/api.service";
import { CitiesService } from "../../../services/cities.service";
import HotelsService from "../../../services/hotels.service";

export async function POST(req) {
  const body = await req.json();

  // Fetch package details
  const pkgDetailRequest = await fetch(
    Api.packages.detail.pbase.url(),
    Api.packages.detail.pbase.options(body)
  );
  const pkgDetailResponse = await pkgDetailRequest.json();

  // Fetch hotels data
  const hotelsData = await HotelsService.getHotelsData(
    pkgDetailResponse.provider,
    pkgDetailResponse.hotels
  );

  // Determine if multiple hotels exist
  const hotelsArray = Array.isArray(hotelsData);

  // Fetch cities data
  const citiesData = hotelsArray
    ? await Promise.all(
        hotelsData.map((hotel) => CitiesService.getCityByCode(hotel.city_id))
      )
    : await CitiesService.getCityByCode(hotelsData.city_id);
  // Construct response
  const response = {
    ...pkgDetailResponse,
    hotelsData,
    citiesData: hotelsArray ? citiesData[0] : citiesData,
  };

  return Response.json(response);
}
