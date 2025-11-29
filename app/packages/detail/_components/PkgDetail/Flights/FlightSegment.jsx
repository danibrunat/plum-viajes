import Image from "next/image";
import { urlForImage } from "../../../../../lib/image";
import { formatFlightDateTime, formatStopovers } from "./helpers";

const AIRLINE_LOGO_SIZE = { width: 80, height: 40 };

/**
 * Componente que renderiza la información de un segmento de vuelo.
 * @param {Object} props
 * @param {Object} props.segment - Datos del segmento de vuelo
 * @param {Object|null} props.airlineLogo - Logo de la aerolínea desde Sanity
 * @param {string|number} props.stopovers - Número de escalas del vuelo
 * @param {boolean} props.showHeader - Si debe mostrar la cabecera con íconos
 */
const FlightSegment = ({
  segment,
  airlineLogo,
  stopovers,
  showHeader,
  headerIcons,
}) => {
  const departureInfo = {
    airportName:
      segment?.departureAirport?.name || segment?.departureCity?.name || "",
    airportCode: segment?.departureAirport?.code || "",
    dateTime: `${segment?.departureDate || ""} ${segment?.departureHour || ""}`,
  };

  const arrivalInfo = {
    airportName:
      segment?.arrivalAirport?.name || segment?.arrivalCity?.name || "",
    airportCode: segment?.arrivalAirport?.code || "",
    dateTime: `${segment?.arrivalDate || ""} ${segment?.arrivalHour || ""}`,
  };

  const logoSrc =
    airlineLogo && airlineLogo[0]?.logo
      ? urlForImage(airlineLogo[0].logo)
      : "/images/imageNotFound.jpg";

  return (
    <div>
      {/* Cabecera con íconos de salida y llegada */}
      {showHeader && headerIcons}

      {/* Información de los aeropuertos y fechas */}
      <div className="flex justify-between text-center border-b-2 border-gray-400">
        {/* Salida */}
        <div className="w-1/3 p-3">
          <span>
            <strong>
              {departureInfo.airportName} ({departureInfo.airportCode})
            </strong>{" "}
            {formatFlightDateTime(departureInfo.dateTime)}
          </span>
        </div>

        {/* Logo aerolínea y escalas */}
        <div className="flex flex-col justify-center items-center w-1/3 p-3">
          <div
            className="relative flex items-center justify-center"
            style={{
              width: AIRLINE_LOGO_SIZE.width,
              height: AIRLINE_LOGO_SIZE.height,
            }}
          >
            <Image
              src={logoSrc}
              fill
              className="object-contain"
              alt={segment?.airline?.code || "airline"}
            />
          </div>
          <span className="mt-1 text-sm text-gray-600">
            {formatStopovers(stopovers)}
          </span>
        </div>

        {/* Llegada */}
        <div className="w-1/3 p-3">
          <span>
            <strong>
              {arrivalInfo.airportName} ({arrivalInfo.airportCode})
            </strong>{" "}
            {formatFlightDateTime(arrivalInfo.dateTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlightSegment;
