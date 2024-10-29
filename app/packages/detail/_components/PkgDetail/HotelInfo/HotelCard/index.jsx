"use client";
import { useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import Slider from "../../../../../../components/commons/Slider";

const HotelCard = ({ hotelData }) => {
  const { name, stars, city_id, description, latitude, longitude } = hotelData;
  const hotelImages = hotelData?.images.map((imageItem) => ({
    src: imageItem.publicUrl,
  }));
  // State to handle text expansion
  const [expanded, setExpanded] = useState(false);

  // Handler to toggle text expansion
  const toggleText = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="w-full h-auto border rounded-lg overflow-hidden shadow-lg p-4">
      {/* Card title */}
      <h2 className="flex flex-col md:flex-row text-md mb-2">
        <p className="w-full md:w-auto font-bold">{name}</p>{" "}
        <div className="flex gap-3">
          <p className="flex text-md gap-1">
            {[...Array(stars)].map((_, index) => (
              <FaStar key={index} className="text-yellow-500 text-sm" />
            ))}
          </p>
          <p>{city_id}</p>
        </div>
      </h2>

      {/* Image section */}
      <div className="relative w-full h-48 mb-4">
        <Slider slides={hotelImages} deviceType="desktop" />
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
        {latitude} {longitude}
      </a>

      {/* Large text (expandable) with ellipsis */}
      <div className={`transition-all ${expanded ? "" : "line-clamp-5"}`}>
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
