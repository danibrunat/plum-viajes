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

const convertSanityBlockToHtml = (description) => {
  return description
    .map((block) => {
      if (block._type === "block") {
        const childrenHtml = block.children
          .map((child) => {
            let text = child.text;
            if (child.marks && child.marks.length > 0) {
              child.marks.forEach((mark) => {
                switch (mark) {
                  case "strong":
                    text = `<strong>${text}</strong>`;
                    break;
                  case "em":
                    text = `<em>${text}</em>`;
                    break;
                  // Puedes agregar más casos para otros tipos de marcas si es necesario
                  default:
                    break;
                }
              });
            }
            return text;
          })
          .join("");
        switch (block.style) {
          case "h1":
            return `<h1>${childrenHtml}</h1>`;
          case "h2":
            return `<h2>${childrenHtml}</h2>`;
          case "h3":
            return `<h3>${childrenHtml}</h3>`;
          case "blockquote":
            return `<blockquote>${childrenHtml}</blockquote>`;
          default:
            return `<p>${childrenHtml}</p>`;
        }
      }
      // Puedes agregar más casos para otros tipos de bloques si es necesario
      return "";
    })
    .join("");
};

const extractHtmlValuesToArray = (htmlString) => {
  if (!htmlString || typeof htmlString !== "string") return [];

  // Verificar si el string contiene etiquetas HTML
  const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(htmlString);
  if (!hasHtmlTags) return [htmlString];

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
  // Si existe .children es porque es un bloque de SAnity por tanto es un paquete propio.
  // Esto debemos mejorarlo en el futuro TODO.

  const renderDescription = () => {
    const packageDescription =
      description && description.length > 0
        ? description[0].children
        : "Sin descripción";
    const sanitizedDescription = packageDescription
      ? convertSanityBlockToHtml(description)
      : extractHtmlValuesToArray(description);

    if (packageDescription) {
      return (
        <div
          className="text-sm text-gray-500"
          dangerouslySetInnerHTML={{
            __html: convertSanityBlockToHtml(description),
          }}
        />
      );
    }

    if (sanitizedDescription.length > 0) {
      return (
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
      );
    }

    return (
      <span className="text-sm text-gray-500">Sin descripción adicional</span>
    );
  };
  console.log(
    "DepartureDetail description",
    JSON.stringify(description, null, 2)
  );

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
        {renderDescription()}
      </div>
    </div>
  );
};

export default DepartureDetail;
