import React from "react";

const ReservationSummary = () => {
  return (
    <div className="flex w-full bg-plumPrimaryPink fixed bottom-0 text-center justify-between p-4 z-[99999] text-white md:justify-center md:bottom-auto md:relative md:rounded-lg">
      <div className="flex flex-row  w-full md:flex-col md:w-1/2 md:gap-3">
        <div className="flex-1 flex-col md:flex">
          <em className="text-xs md:text-md">
            Precio final por persona desde:
          </em>
          <p className="text-xl font-bold">USD 1100</p>
        </div>
        <div className="flex-1 flex-col md:flex">
          <p className="text-xs md:text-md">
            Total 2 adultos en Hab. Doble USD 2.200
          </p>
        </div>
        <div className="flex-1 md:hidden">
          <button className="bg-plumPrimaryOrange text-md p-3 rounded">
            Consultar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationSummary;
