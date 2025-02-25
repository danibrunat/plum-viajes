import React from "react";
import {
  capitalizeFirstLetter,
  toLowerCase,
} from "../../../../../helpers/strings";

const getRoomSummary = (rooms) => {
  if (!rooms || rooms.length === 0) return "Sin habitaciones seleccionadas.";

  let totalAdults = 0;
  let totalChildren = 0;
  const totalRooms = rooms.length;

  // Calcular totales de adultos y niños
  rooms.forEach((room) => {
    totalAdults += room.adults || 0;
    totalChildren += room.children?.length || 0;
  });

  // Construir texto
  const adultsText = `${totalAdults} adulto${totalAdults > 1 ? "s" : ""}`;
  const childrenText =
    totalChildren > 0
      ? ` y ${totalChildren} niño${totalChildren > 1 ? "s" : ""}`
      : "";
  const roomsText = `(${totalRooms} Hab${totalRooms > 1 ? "s" : "."})`;

  return `${adultsText}${childrenText} ${roomsText}`;
};

const extractHtmlValuesToArray = (htmlString) => {
  if (!htmlString || typeof htmlString !== "string") return [];

  let document;

  if (typeof window !== "undefined" && window.DOMParser) {
    // Estamos en el navegador
    const parser = new DOMParser();
    document = parser.parseFromString(htmlString, "text/html");
  } else {
    // Estamos en Node.js (Servidor en Next.js)
    const { JSDOM } = require("jsdom");
    document = new JSDOM(htmlString).window.document;
  }

  const extractedTexts = [];

  // Extraer texto de etiquetas relevantes
  document.querySelectorAll("p, div, span, strong, em").forEach((el) => {
    const text = el.textContent.trim();
    if (text) extractedTexts.push(text);
  });

  return extractedTexts;
};

const DepartureDetail = ({
  description,
  departureDate,
  hotels,
  roomConfig,
}) => {
  const sanitizedDescription = extractHtmlValuesToArray(description);
  const hotelName = capitalizeFirstLetter(toLowerCase(hotels[0]?.name));
  const hotelMealPlan = capitalizeFirstLetter(toLowerCase(hotels[0]?.mealPlan));
  const hotelRating = hotels[0]?.rating;
  const roomSummary = getRoomSummary(roomConfig);
  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-4  items-start justify-between w-full p-3 rounded  bg-gray-600">
        <div className="flex flex-col">
          <em className="text-xs text-gray-200">Fecha de salida</em>
          <span className="text-md text-white font-bold">{departureDate}</span>
        </div>
        <div className="flex flex-col">
          <em className="text-xs text-gray-200">Hotel</em>
          <div className="text-md text-white ">
            <span className="font-bold">{hotelName} </span> <br />
            <em className="text-gray-200 text-xs">
              ({hotelRating} estrellas) {hotelMealPlan}
            </em>
          </div>
        </div>
        <div className="flex flex-col">
          <em className="text-xs text-gray-200">Pasajeros</em>
          <div className="text-md text-white">
            <span className="font-bold"> {roomSummary} </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col border-2 gap-3 rounded-md border-gray-400 p-3">
        {sanitizedDescription.length > 0 ? (
          <>
            <em className="text-sm underline font-bold">Incluye:</em>
            <ul className="list-disc list-inside">
              {Array.isArray(sanitizedDescription)
                ? sanitizedDescription.map((descItem) => (
                    <li key={descItem}>{descItem}</li>
                  ))
                : sanitizedDescription}
            </ul>
          </>
        ) : (
          <span className="text-sm text-gray-500">
            Sin descripción adicional
          </span>
        )}
      </div>
    </div>
  );
};

export default DepartureDetail;
