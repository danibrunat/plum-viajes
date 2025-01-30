"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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

const Slider = ({ slides, deviceType = "desktop" }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slides && slides.length > 0) {
      setIsLoading(false);
    }
  }, [slides]);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1,
    },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 3, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 767, min: 464 }, items: 2, slidesToSlide: 1 },
  };

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : slides?.length > 0 ? (
        <Carousel
          responsive={responsive}
          autoPlay={true}
          autoPlaySpeed={2500}
          partialVisible={true}
          itemClass="p-5"
        >
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
            />
          ))}
        </Carousel>
      ) : (
        <p className="text-center text-gray-500">
          No hay imágenes disponibles.
        </p>
      )}
    </>
  );
};

export default Slider;
