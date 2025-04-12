import Image from "next/image";
import React from "react";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import { groq } from "next-sanity";
import { urlForImage } from "../../../../../lib/image";
import { sanityFetch } from "../../../../../lib/sanityFetch";

const Flights = ({ flights }) => {
  // Función para formatear la fecha
  function formatDateToString(dateString) {
    if (!dateString) return "Fecha inválida"; // Manejo de errores

    const daysOfWeek = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
    const monthsOfYear = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    try {
      // Reemplazar espacio por 'T' para formato ISO válido
      const normalizedDateString = dateString.replace(" ", "T");

      // Intentar crear el objeto Date
      const date = new Date(normalizedDateString);

      // Validar que la fecha es válida
      if (isNaN(date.getTime())) {
        console.error("Fecha inválida:", dateString);
        return "Fecha inválida";
      }

      // Extraer partes de la fecha
      const dayOfWeek = daysOfWeek[date.getDay()];
      const day = date.getDate().toString().padStart(2, "0");
      const month = monthsOfYear[date.getMonth()];
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      // Crear el string formateado
      return `${capitalize(dayOfWeek)}, ${day} de ${month}\n${hours}:${minutes}`;
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "Fecha inválida";
    }
  }

  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const renderSegments = async (flight) => {
    if (Array.isArray(flight.segments)) {
      return flight.segments.map(async (segment, segmentIndex) => {
        const airlineLogoQuery = groq`*[_type == 'airline' && code == '${segment.airline.code}'] { logo }`;
        const airlineLogo = await sanityFetch({ query: airlineLogoQuery });

        return (
          <div key={segmentIndex}>
            {/* Cabecera con íconos de salida y llegada */}
            {segmentIndex === 0 && (
              <div className="flex justify-between mx-10 border-b-2 border-gray-400 py-4">
                <FaPlaneDeparture className="text-2xl" />
                <FaPlaneArrival className="text-2xl" />
              </div>
            )}

            {/* Información de los aeropuertos y fechas */}
            <div className="flex justify-between text-center border-b-2 border-gray-400">
              <div className="w-1/3 p-3">
                <span>
                  <strong>
                    {segment?.departureAirport?.name || ""} (
                    {segment?.departureAirport?.code || ""})
                  </strong>{" "}
                  {formatDateToString(
                    `${segment.departureDate} ${segment.departureHour}`
                  )}
                </span>
              </div>

              <div className="flex flex-col justify-center items-center w-1/3 p-3">
                <Image
                  src={
                    airlineLogo && airlineLogo[0].logo
                      ? urlForImage(airlineLogo[0].logo)
                      : "/images/imageNotFound.jpg"
                  }
                  width={70}
                  height={70}
                  alt={segment.airline.code}
                />
                {flight.stopovers == 0
                  ? "Directo"
                  : `${flight.stopovers} Escalas`}
              </div>

              <div className="w-1/3 p-3">
                <span>
                  <strong>
                    {segment?.arrivalAirport.name ?? ""} (
                    {segment?.arrivalAirport.code ?? ""})
                  </strong>{" "}
                  {formatDateToString(
                    `${segment.arrivalDate} ${segment.arrivalHour}`
                  )}
                </span>
              </div>
            </div>
          </div>
        );
      });
    }

    const airlineLogoQuery = groq`*[_type == 'airline' && code == '${segment.airline.code}'] { logo }`;
    const airlineLogo = await sanityFetch({ query: airlineLogoQuery });
    return (
      <div key={flight.segments.flightNumber}>
        {/* Cabecera con íconos de salida y llegada */}
        <div className="flex justify-between mx-10 border-b-2 border-gray-400 py-4">
          <FaPlaneDeparture className="text-2xl" />
          <FaPlaneArrival className="text-2xl" />
        </div>

        {/* Información de los aeropuertos y fechas */}
        <div className="flex justify-between text-center border-b-2 border-gray-400">
          <div className="w-1/3 p-3">
            <span>
              <strong>
                {flight.segments.departureCity.name} (
                {flight.segments.departureAirport.code})
              </strong>{" "}
              {formatDateToString(
                `${flight.segments.departureDate} ${flight.segments.departureHour}`
              )}
            </span>
          </div>

          <div className="flex flex-col justify-center items-center w-1/3 p-3">
            <Image
              src={
                airlineLogo
                  ? urlForImage(segment.airline.logo)
                  : segment.airline.logo
              }
              width={125}
              height={70}
              alt={flight.segments.airline.code}
            />
            {flight.stopovers == 0 ? "Directo" : `${flight.stopovers} Escalas`}
          </div>

          <div className="w-1/3 p-3">
            <span>
              <strong>
                {flight.segments.arrivalCity.name} (
                {flight.segments.arrivalAirport.code})
              </strong>{" "}
              {formatDateToString(
                `${flight.segments.arrivalDate} ${flight.segments.arrivalHour}`
              )}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      {flights.map((flight, index) => (
        <div
          key={index}
          className="flex flex-col rounded-md justify-between border-2 border-gray-400 p-5 mb-4"
        >
          {renderSegments(flight)}
        </div>
      ))}
    </div>
  );
};

export default Flights;
