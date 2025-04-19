"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import CommonCarousel from "../Carousel";

// Skeleton Loader
const Skeleton = () => (
  <div className="flex gap-4">
    {Array(4)
      .fill("")
      .map((_, index) => (
        <div
          key={index}
          className="w-[300px] h-[200px] bg-gray-300 animate-pulse rounded-lg"
        ></div>
      ))}
  </div>
);

// Define a fallback image URL
const FALLBACK_IMAGE_URL = "/images/no-image.jpeg";

const Slider = ({ slides, deviceType = "desktop" }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simplificar la lógica
    setIsLoading(!slides);
  }, [slides]);

  // onError handler simplificado
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE_URL;
  };

  if (isLoading) return <Skeleton />;

  if (!slides || slides.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay imágenes disponibles.</p>
    );
  }

  return (
    <CommonCarousel>
      {slides.map((slide, index) => (
        <Image
          key={index}
          src={slide.src}
          alt={slide.alt || "Imagen del slider"}
          width={deviceType === "desktop" ? 300 : 200}
          height={deviceType === "desktop" ? 250 : 150}
          sizes="100vw"
          style={{
            width: "100%",
            height: deviceType === "desktop" ? "200px" : "auto",
            objectFit: "cover",
            borderRadius: "8px",
          }}
          onError={handleImageError}
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
        />
      ))}
    </CommonCarousel>
  );
};

export default Slider;
