"use client";
import { useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import Slider from "../../../../../components/commons/Slider";

const HotelCard = ({ hotelData }) => {
  const { name, stars, city, description, latitude, longitude, images } =
    hotelData;

  const hotelImages = images.map((imageItem) => ({
    src: imageItem,
  }));
  // State to handle text expansion
  const [expanded, setExpanded] = useState(false);

  // Handler to toggle text expansion
  const toggleText = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="w-full h-auto border rounded-lg overflow-hidden shadow-lg p-4 ">
      {/* Card title */}
      <h2 className="flex flex-col md:flex-row text-md mb-4">
        <p className="w-full md:w-auto font-bold">{name}</p>{" "}
        <div className="flex gap-3">
          <p className="flex text-md gap-1">
            {[...Array(stars)].map((_, index) => (
              <FaStar key={index} className="text-yellow-500 text-sm" />
            ))}
          </p>
          <p>{`${city.name} (${city.iata_code})`}</p>
          {/* Map link with marker icon */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&zoom=15`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700  rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md justify-center"
          >
            <FaMapMarkerAlt className="text-lg group-hover:scale-110 transition-transform duration-200" />
            <span>Ver ubicación</span>
          </a>
        </div>
      </h2>

      {hotelImages.length > 0 && (
        <div className="relative w-full h-52 mb-4">
          <Slider slides={hotelImages} deviceType="desktop" />
        </div>
      )}

      {/* Large text (expandable) with ellipsis */}
      <div className={`transition-all ${expanded ? "" : "line-clamp-5"} py-3`}>
        <p className="text-gray-700">{description}</p>
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
