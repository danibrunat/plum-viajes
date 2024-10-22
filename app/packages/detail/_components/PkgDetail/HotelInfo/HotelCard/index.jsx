"use client";
import { useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import Slider from "../../../../../../components/commons/Slider";

const HotelCard = ({ sliderImages }) => {
  // State to handle text expansion
  const [expanded, setExpanded] = useState(false);

  // Handler to toggle text expansion
  const toggleText = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="w-full h-auto border rounded-lg overflow-hidden shadow-lg p-4">
      {/* Card title */}
      <h2 className="flex text-xl font-bold mb-2">
        <span>Posada New Paradise</span>{" "}
        <span className="flex">
          <FaStar className="text-yellow-500" />{" "}
          <FaStar className="text-yellow-500" />
        </span>
        <span>Búzios</span>
      </h2>

      {/* Image section */}
      <div className="relative w-full h-48 mb-4">
        <Slider slides={sliderImages} deviceType="desktop" />
      </div>

      {/* Map link with marker icon */}
      <a
        href="https://www.google.com/maps"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 flex items-center mb-4 justify-center"
      >
        <FaMapMarkerAlt className="mr-2" />
        <span>Ver mapa</span>
      </a>

      {/* Large text (expandable) with ellipsis */}
      <div className={`transition-all ${expanded ? "" : "line-clamp-5"}`}>
        <p className="text-gray-700">
          La Pousada New Paradise está ubicada a 150 metros de la famosa y
          concurrida Playa de Joao Fernandes y a 10 minutos de caminata, por la
          Orla Bardot, de Rua das Pedras. Ofrece los siguientes servicios:
          Pileta, Bar, Desayuno, Salón de juegos, Sala TV/DVD, estacionamiento,
          Parrilla, y Balcón vista mar Las habitaciones están equipadas con TV,
          frigobar, aire acondicionado, ventilador de techo y teléfono. Todas
          tienen balcón con vista al mar.
        </p>
      </div>

      {/* "Ver más" button */}
      <div className="flex justify-end">
        <button onClick={toggleText} className="mt-4 text-blue-500">
          {expanded ? "Ver menos" : "Ver más"}
        </button>
      </div>
    </div>
  );
};

export default HotelCard;
