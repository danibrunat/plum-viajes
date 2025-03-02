import { Api } from "../../../services/api.service";
import { CitiesService } from "../../../services/cities.service";
import HotelsService from "../../../services/hotels.service";
import AirlinesService from "../../../services/airlines.service";
import crypto from "crypto";
import CryptoService from "../../services/cypto.service";

const generateDepartureId = (provider, departureDate) => {
  return crypto
    .createHash("md5")
    .update(`${provider}-${departureDate}`)
    .digest("hex");
};

const mapFlightSegment = async (segment) => {
  const airlineData = await AirlinesService.getAirlineData(
    segment.airline.code
  );
  segment.airline = airlineData;
  return segment;
};

export async function POST(req) {
  const body = await req.json();
  // Extraer el departureId de la query string
  const departureIdFromQuery = body.departureId;
  if (!departureIdFromQuery) {
    return Response.json({ error: "Missing departureId" }, { status: 400 });
  }

  // Extraer el cuerpo de la solicitud
  if (!body || Object.keys(body).length === 0) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Obtener los detalles del paquete
  const pBaseRequest = await fetch(
    Api.packages.detail.pbase.url(),
    Api.packages.detail.pbase.options(body)
  );
  const pBaseDetailResponse = await pBaseRequest.json();
  if (!pBaseDetailResponse || pBaseDetailResponse.length === 0) {
    return Response.json([]);
  }

  // Verificar que departures es un array
  const departures = pBaseDetailResponse.departures;
  if (!Array.isArray(departures)) {
    return Response.json(
      { error: "Departures must be an array" },
      { status: 500 }
    );
  }

  // Generar el departureId en cada objeto de departures sin alterar la estructura
  const provider = pBaseDetailResponse.provider;
  const updatedDepartures = departures.map((departure) => ({
    ...departure,
    departureId: CryptoService.generateDepartureId(provider, departure.date),
  }));
  // Verificar que alguno de los departures coincide con el departureId recibido
  const matchingDeparture = updatedDepartures.find(
    (dep) => dep.departureId === departureIdFromQuery
  );
  if (!matchingDeparture) {
    return Response.json({ error: "Departure not found" }, { status: 404 });
  }

  // Actualizar la propiedad departures de la respuesta con la información enriquecida
  pBaseDetailResponse.departures = updatedDepartures;

  // Procesar hoteles asociados a la salida seleccionada
  const hotelsArray = Array.isArray(matchingDeparture.hotels)
    ? matchingDeparture.hotels
    : [];

  const hotelsData = await Promise.all(
    hotelsArray.map((hotel) => HotelsService.getHotelData(provider, hotel))
  );

  // Procesar la data de ciudades según los hoteles
  const citiesData = await Promise.all(
    hotelsData.map((hotel) => CitiesService.getCityByCode(hotel.city_id, true))
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
  console.log(
    "updatedFlightSegments",
    JSON.stringify(updatedFlightSegments, null, 2)
  );

  // Devolver la respuesta manteniendo la estructura original
  // (departures ya contiene la propiedad departureId en cada objeto)
  const response = {
    ...pBaseDetailResponse,
    hotelsData,
    citiesData,
  };

  return Response.json(response);
}
