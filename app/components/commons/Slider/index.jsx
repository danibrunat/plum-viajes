"use client";
import Image from "next/image";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Slider = ({ slides, deviceType = "desktop" }) => {
  const slideSizes = {
    desktop: {
      width: 1900,
      height: 1200,
    },
    mobile: {
      width: 300,
      height: 250,
    },
  };
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <Carousel
      swipeable={true}
      draggable={true}
      showDots={true}
      responsive={responsive}
      ssr={true} // means to render carousel on server-side.
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={3500}
      keyBoardControl={true}
      customTransition="all .5"
      transitionDuration={500}
      deviceType={deviceType}
      partialVisible={true}
    >
      {slides.map((slide, index) => (
        <Image
          key={index + 1}
          src={slide.src}
          alt={slide.alt || `Slide ${index + 1}`}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
        />
      ))}
    </Carousel>
  );
};

export default Slider;
