import Image from "next/image";
import React from "react";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";

const Flights = ({ flights }) => {
  // Función para formatear la fecha
  function formatDateToString(dateString) {
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

    // Crear un objeto Date a partir del string de fecha
    const date = new Date(dateString);

    // Extraer partes de la fecha
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate().toString().padStart(2, "0");
    const month = monthsOfYear[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Crear el string formateado
    return `${capitalize(dayOfWeek)}, ${day} de ${month}\n${hours}:${minutes}`;
  }

  // Función auxiliar para capitalizar la primera letra de un string
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const renderSegments = (flight) => {
    if (Array.isArray(flight.segments))
      return flight.segments.map((segment, segmentIndex) => (
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
                  {segment.departureAirport.name} (
                  {segment.departureAirport.code})
                </strong>{" "}
                {formatDateToString(
                  `${segment.departureDate} ${segment.departureHour}`
                )}
              </span>
            </div>

            <div className="flex flex-col justify-center items-center w-1/3 p-3">
              <Image
                src={segment.airline.logoUrl}
                width={125}
                height={70}
                alt={segment.airline.code}
              />
              {flights.stopovers == 0
                ? "Directo"
                : `${flights.stopovers} Escalas`}
            </div>

            <div className="w-1/3 p-3">
              <span>
                <strong>
                  {segment.arrivalAirport.name} ({segment.arrivalAirport.code})
                </strong>{" "}
                {formatDateToString(
                  `${segment.arrivalDate} ${segment.arrivalHour}`
                )}
              </span>
            </div>
          </div>
        </div>
      ));

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
              src={flight.segments.airline.logoUrl}
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
