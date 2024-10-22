import React from "react";

const DepartureDetail = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-4  items-start justify-between w-full p-3 rounded  bg-gray-600">
        <div className="flex flex-col">
          <em className="text-xs text-gray-200">Fecha de salida</em>
          <span className="text-md text-white font-bold">8-feb-25</span>
        </div>
        <div className="flex flex-col">
          <em className="text-xs text-gray-200">Hotel</em>
          <div className="text-md text-white ">
            <span className="font-bold">Posada New Paradise </span> <br />
            <em className="text-gray-200 text-xs">* * * (Con desayuno)</em>
          </div>
        </div>
        <div className="flex flex-col">
          <em className="text-xs text-gray-200">Pasajeros</em>
          <div className="text-md text-white">
            <span className="font-bold">2 adultos </span>
            <em className="text-gray-200 text-xs">(1 Hab.)</em>
          </div>
        </div>
      </div>
      <div className="flex flex-col border-2 gap-3 rounded-md border-gray-400 p-3">
        <em className="text-sm underline font-bold">Incluye:</em>
        <ul className="list-disc list-inside">
          <li>Vuelos BUE/GIG/BUE (Ver itinerario)</li>
          <li>08 Noches de alojamiento con regimen DESAYUNO</li>
          <li>Traslados de entrada y salida</li>
          <li>Asistencia al viajero (Cobertura USD 60.000)</li>
          <li>Articulo personal como equipaje incluido (Hasta 10 Kg)</li>
        </ul>
      </div>
    </div>
  );
};

export default DepartureDetail;
