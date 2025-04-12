"use client";
import { useState } from "react";
import Slider from "../../../../../components/commons/Slider";
import { urlForImage } from "../../../../../lib/image";

const DestinationCity = ({ city }) => {
  // State to handle text expansion
  const [expanded, setExpanded] = useState(false);
  const { id, name, description, label, value, images } = city;
  const cityImages = images.map((imageItem) => ({
    src: imageItem?.asset ? urlForImage(imageItem) : imageItem,
  }));

  // Handler to toggle text expansion
  const toggleText = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="w-full h-auto border rounded-lg overflow-hidden shadow-lg p-4">
      {/* Card title */}
      <h2 className="flex text-xl font-bold mb-2">{name}</h2>

      {/* Image section */}
      {cityImages.length > 0 && (
        <div className="relative w-full h-56 mb-4">
          <Slider slides={cityImages} deviceType="desktop" />
        </div>
      )}

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

export default DestinationCity;
