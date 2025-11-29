import { groq } from "next-sanity";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import { sanityFetch } from "../../../../../lib/sanityFetch";
import FlightSegment from "./FlightSegment";

/**
 * Obtiene el logo de una aerolínea desde Sanity.
 * @param {string} airlineCode - Código IATA de la aerolínea
 * @returns {Promise<Array>} - Array con el logo o vacío
 */
async function fetchAirlineLogo(airlineCode) {
  if (!airlineCode) return null;
  const query = groq`*[_type == 'airline' && code == '${airlineCode}'] { logo }`;
  return sanityFetch({ query });
}

/**
 * Cabecera con íconos de salida y llegada para los vuelos.
 */
const FlightHeader = () => (
  <div className="flex justify-between mx-10 border-b-2 border-gray-400 py-4">
    <FaPlaneDeparture className="text-2xl" />
    <FaPlaneArrival className="text-2xl" />
  </div>
);

/**
 * Normaliza los segmentos de un vuelo a un array.
 * @param {Object} flight - Objeto de vuelo
 * @returns {Array} - Array de segmentos
 */
function normalizeSegments(flight) {
  if (Array.isArray(flight.segments)) {
    return flight.segments;
  }
  // Si segments es un objeto único, lo convertimos en array
  return flight.segments ? [flight.segments] : [];
}

/**
 * Componente que muestra todos los segmentos de un vuelo.
 */
const FlightCard = async ({ flight }) => {
  const segments = normalizeSegments(flight);

  const segmentsWithLogos = await Promise.all(
    segments.map(async (segment) => {
      const airlineLogo = await fetchAirlineLogo(segment?.airline?.code);
      return { segment, airlineLogo };
    })
  );

  return (
    <div className="flex flex-col rounded-md justify-between border-2 border-gray-400 p-5 mb-4">
      {segmentsWithLogos.map(({ segment, airlineLogo }, index) => (
        <FlightSegment
          key={segment?.flightNumber || index}
          segment={segment}
          airlineLogo={airlineLogo}
          stopovers={flight.stopovers}
          showHeader={index === 0}
          headerIcons={<FlightHeader />}
        />
      ))}
    </div>
  );
};

/**
 * Componente principal que muestra la lista de vuelos de un paquete.
 * @param {Object} props
 * @param {Array} props.flights - Lista de vuelos del paquete
 */
const Flights = ({ flights }) => {
  if (!flights || flights.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      {flights.map((flight, index) => (
        <FlightCard key={index} flight={flight} />
      ))}
    </div>
  );
};

export default Flights;
