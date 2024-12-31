"use client";
import React from "react";
import TaggedPackageItem from "../TaggedPackageItem";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const TaggedCarousel = ({ taggedPackagesResponse }) => {
  return (
    <Carousel
      responsive={responsive}
      autoPlay={true}
      autoPlaySpeed={2500}
      partialVisible={false}
      itemClass="p-5"
    >
      {taggedPackagesResponse.map((taggedPackage) => (
        <TaggedPackageItem
          key={taggedPackage._id}
          taggedPackage={taggedPackage}
        />
      ))}
    </Carousel>
  );
};

export default TaggedCarousel;
