import React from "react";
import Autocomplete from "./Autocomplete";
import {
  FaGlobeAmericas,
  FaCalendar,
  FaMapMarked,
  FaSearch,
} from "react-icons/fa";

export default function PackagesEngine() {
  return (
    <form className="flex justify-center gap-2">
      <div className="flex flex-col gap-2 w-1/4">
        <span className="block text-center text-white">¿Donde querés ir?</span>
        <div className="flex justify-center items-center">
          <div className="p-3">
            <FaGlobeAmericas className="text-gray-200" />
          </div>
          <Autocomplete />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-1/4 text-center">
        <span className="block text-center text-white">
          ¿Cuándo pensás viajar?
        </span>
        <div className="flex justify-center items-center">
          <div className="p-3">
            <FaCalendar className="text-gray-200" />
          </div>
          <select className="w-full p-1">
            <option value="">Elegí el mes de tu viaje...</option>
            <option value="">Marzo</option>
            <option value="">Abril</option>
            <option value="">Mayo</option>
            <option value="">Junio</option>
            <option value="">Julio</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-1/4 text-center">
        <span className="block text-center text-white">
          ¿Desde qué ciudad partís?
        </span>
        <div className="flex justify-center items-center">
          <div className="p-3">
            <FaMapMarked className="text-gray-200" />
          </div>
          <select className="w-full p-1">
            <option value="">Indistinto</option>
            <option value="">Asunción</option>
            <option value="">Bahía Blanca</option>
            <option value="">Bariloche</option>
            <option value="">Buenos Aires</option>
            <option value="">Córdoba</option>
          </select>
        </div>
      </div>
      <div className="flex w-1/4 items-center justify-center ">
        <div className="flex p-3 w-auto transition ease-in-out delay-50 rounded hover:-translate-y-1 hover:scale-110 hover:bg-red-400 duration-300">
          <button className="flex gap-2 items-center text-white" type="submit">
            <FaSearch className="text-gray-200" /> Buscar Paquetes
          </button>
        </div>
      </div>
    </form>
  );
}
