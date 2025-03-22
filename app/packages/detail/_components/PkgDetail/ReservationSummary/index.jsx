import React from "react";
import Formatters from "../../../../../services/formatters.service";

const normalizeText = (text) => {
  if (!text || typeof text !== "string") return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const getRoomSummaryText = (rooms, pricePerPerson, currency, roomType) => {
  if (!rooms || rooms.length === 0)
    return normalizeText("Sin habitaciones seleccionadas.");

  let totalPeople = 0;

  let roomTexts = rooms.map((room, index) => {
    const { adults, children } = room;
    const totalInRoom = adults + children.length;
    totalPeople += totalInRoom;

    // Texto para adultos
    const adultText = adults === 1 ? "1 adulto" : `${adults} adultos`;

    // Texto para niños solo si existen
    const childrenCount = children.length;
    const childrenText = childrenCount
      ? childrenCount === 1
        ? " y 1 niño"
        : ` y ${childrenCount} niños`
      : "";

    // Construir texto por habitación
    return normalizeText(
      `Total ${adultText}${childrenText} en Habitación ${roomType}`
    );
  });

  // Calcular el precio total
  const totalPrice = totalPeople * pricePerPerson;
  roomTexts.push(Formatters.price(totalPrice, currency));

  return normalizeText(roomTexts.join(": ") + ".");
};

const ReservationSummary = ({
  currency,
  finalPrice,
  occupancy,
  hotels,
  isSoldOutDeparture,
}) => {
  const roomType = hotels?.[0]?.roomSize;
  const pricePerPerson = Formatters.price(finalPrice, currency);
  const finalPriceText = getRoomSummaryText(
    occupancy,
    finalPrice,
    currency,
    roomType
  );
  return (
    <div className="flex w-full bg-plumPrimaryPurple fixed bottom-0 text-center justify-between p-4 z-[99999] text-white md:justify-center md:bottom-auto md:relative md:rounded-lg">
      <div className="flex flex-row  w-full md:flex-col md:w-1/2 md:gap-3">
        {!isSoldOutDeparture ? (
          <>
            <div className="flex-1 flex-col md:flex">
              <em className="text-xs md:text-md">
                Precio final por persona desde:
              </em>
              <p className="text-xl font-bold">{pricePerPerson}</p>
            </div>
            <div className="flex-1 flex-col md:flex">
              <p className="text-md">{finalPriceText}</p>
            </div>
            <div className="flex-1 md:hidden">
              <button className="bg-plumPrimaryOrange text-md p-3 rounded">
                Consultar
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex-col md:flex">
            <em className="text-xs md:text-md">Agotado</em>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationSummary;
