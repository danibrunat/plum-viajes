import React from "react";

const Placeholder = () => {
  return (
    <div className="flex flex-col w-full space-y-6">
      <em className="text-xs text-gray-500">Cargando fechas de salida...</em>

      <div className="flex flex-col space-y-4 bg-gray-100 rounded-md p-6 md:flex-row md:gap-6 md:items-center md:space-y-0 md:w-full">
        <div className="w-full">
          <div className="h-4 bg-gray-300 rounded w-28 mb-3"></div>
          <div className="h-12 bg-gray-200 rounded-md w-full"></div>
        </div>

        <div className="flex flex-1 space-x-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-20 mb-3"></div>
            <div className="h-12 bg-gray-200 rounded-md"></div>
          </div>

          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-20 mb-3"></div>
            <div className="h-12 bg-gray-200 rounded-md"></div>
          </div>

          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-20 mb-3"></div>
            <div className="h-12 bg-gray-200 rounded-md"></div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 w-full">
          <div className="h-4 bg-gray-300 rounded w-40 mb-3"></div>
          <div className="h-12 bg-gray-200 rounded-md"></div>
        </div>

        <button className="self-end bg-orange-300 text-transparent py-3 px-5 rounded-md cursor-not-allowed">
          Cargando...
        </button>
      </div>
    </div>
  );
};

export default Placeholder;
