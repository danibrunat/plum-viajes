import { Api } from "../../../services/api.service";
import { CitiesService } from "../../../services/cities.service";
import HotelsService from "../../../services/hotels.service";
import AirlinesService from "../../../services/airlines.service";

const mapFlightSegment = async (segment) => {
  const airlineData = await AirlinesService.getAirlineData(
    segment.airline.code
  );
  segment.airline = airlineData;
  return segment;
};

export async function POST(req) {
  const body = await req.json();

  if (!body || Object.keys(body).length === 0) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Fetch package details
  const pBaseRequest = await fetch(
    Api.packages.detail.pbase.url(),
    Api.packages.detail.pbase.options(body)
  );
  const pBaseDetailResponse = await pBaseRequest.json();

  if (pBaseDetailResponse.length === 0) return Response.json([]);
  // Fetch hotels data. Check if pkgDetailResponse is an array of more than one item. In that case, we fetch an array of hotels data.
  //const provider = pkgDetailResponse[0].provider;
  const provider = pBaseDetailResponse?.provider;
  const hotelsArray = Array.isArray(pBaseDetailResponse?.hotels)
    ? pBaseDetailResponse.hotels
    : [];
  const flightSegments = Array.isArray(pBaseDetailResponse?.flights)
    ? pBaseDetailResponse.flights
    : [];

  // Fetch hotels data
  const hotelsData = await Promise.all(
    hotelsArray.map((hotel) => HotelsService.getHotelData(provider, hotel))
  );

  // Fetch cities data
  const citiesData = await Promise.all(
    hotelsData.map((hotel) => CitiesService.getCityByCode(hotel.city_id, true))
  );
  // Fetch airline Data
  const updatedFlightSegments = await Promise.all(
    flightSegments.map(async (flight) => {
      if (!Array.isArray(flight.segments)) {
        // Sin escalas. segments es un objeto
        flight.segments = await mapFlightSegment(flight.segments);
      } else {
        // Con escalas
        flight.segments = await Promise.all(
          flight.segments.map(
            async (segment) => await mapFlightSegment(segment)
          )
        );
      }
      return flight;
    })
  );

  // Construct response
  const response = {
    ...pBaseDetailResponse,
    hotelsData,
    flights: updatedFlightSegments,
    citiesData,
  };

  return Response.json(response);
}
