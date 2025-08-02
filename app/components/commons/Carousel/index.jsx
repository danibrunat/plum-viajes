"use client";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const DEFAULT_DESKTOP_ITEMS = 4;

const CommonCarousel = ({
  desktopItems = DEFAULT_DESKTOP_ITEMS,
  children = [],
  itemClass = "p-1 md:p-2",
}) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: desktopItems,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 767, min: 200 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  return (
    <Carousel
      responsive={responsive}
      autoPlay={true}
      infinite={true}
      autoPlaySpeed={2500}
      partialVisible={false}
      itemClass={itemClass}
    >
      {children}
    </Carousel>
  );
};

export default CommonCarousel;
