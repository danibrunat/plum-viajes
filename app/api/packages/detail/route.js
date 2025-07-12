import { Api } from "../../../services/api.service";
import CitiesService from "../../../services/cities.service";
import HotelsService from "../../../services/hotels.service";
import AirlinesService from "../../../services/airlines.service";
import { CacheService } from "../../services/cache";

const mapFlightSegment = async (segment) => {
  const airlineData = await AirlinesService.getAirlineData(
    segment.airline.code
  );
  segment.airline = airlineData;
  return segment;
};

export async function POST(req) {
  const body = await req.json();

  // Extraer el cuerpo de la solicitud
  if (!body || Object.keys(body).length === 0) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Intentar obtener desde cache
  const cachedResponse = await CacheService.packages.getDetailFromCache(
    body.provider,
    body.id,
    body
  );

  if (cachedResponse) {
    console.log("Cache HIT - Devolviendo detalles cacheados");
    return Response.json(cachedResponse);
  }

  console.log("Cache MISS - Obteniendo detalles frescos");

  // Obtener datos frescos
  const pBaseRequest = await fetch(
    Api.packages.detail.pbase.url(),
    Api.packages.detail.pbase.options(body)
  );
  const pBaseDetailResponse = await pBaseRequest.json();

  if (!pBaseDetailResponse || pBaseDetailResponse.length === 0) {
    return Response.json([]);
  }

  // ...existing code...

  // Verificar que departures es un array
  const departures = pBaseDetailResponse.departures;
  if (!Array.isArray(departures)) {
    return Response.json(
      { error: "Departures must be an array" },
      { status: 500 }
    );
  }

  const provider = pBaseDetailResponse.provider;

  // Seleccionar la salida correspondiente a startDate
  const selectedDeparture = departures.find(
    (departure) => departure.date === body.startDate
  );

  if (!selectedDeparture) {
    return Response.json(
      { error: "No se encontró la salida con la startDate especificada." },
      { status: 404 }
    );
  }

  // Procesar hoteles asociados a la salida seleccionada
  const hotelsArray = Array.isArray(selectedDeparture.hotels)
    ? selectedDeparture.hotels
    : [];

  const hotelsData = await Promise.all(
    hotelsArray.map((hotel) =>
      HotelsService.getHotelData(provider, hotel, body.arrivalCity)
    )
  );

  console.log("hotelsData", hotelsData);

  // Procesar la data de ciudades según los hoteles
  const citiesData = await Promise.all(
    hotelsData.map((hotel) =>
      CitiesService.getCityByCode(hotel.city.iata_code, true)
    )
  );

  // Procesar segmentos de vuelo (si existen en la respuesta)
  const flightSegments = Array.isArray(
    pBaseDetailResponse.departures[0].flights
  )
    ? pBaseDetailResponse.departures[0].flights
    : [];

  const updatedFlightSegments = await Promise.all(
    flightSegments.map(async (flight) => {
      if (!Array.isArray(flight.segments)) {
        flight.segments = await mapFlightSegment(flight.segments);
      } else {
        flight.segments = await Promise.all(
          flight.segments.map(
            async (segment) => await mapFlightSegment(segment)
          )
        );
      }
      return flight;
    })
  );

  pBaseDetailResponse.flights = updatedFlightSegments;
  // Devolver la respuesta manteniendo la estructura original
  // (departures ya contiene la propiedad departureId en cada objeto)
  const response = {
    ...pBaseDetailResponse,
    hotelsData,
    citiesData,
  };

  // Guardar en cache para futuras consultas (usando políticas centralizadas)
  await CacheService.packages.setDetailCache(
    body.provider,
    body.id,
    body,
    response
    // El TTL se obtiene automáticamente de las políticas
  );

  return Response.json(response);
}
