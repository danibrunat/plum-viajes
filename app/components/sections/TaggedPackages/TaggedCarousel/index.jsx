"use client";
import React from "react";
import TaggedPackageItem from "../TaggedPackageItem";
import CommonCarousel from "../../../commons/Carousel";

const TaggedCarousel = ({ taggedPackagesResponse }) => {
  return (
    <CommonCarousel>
      {taggedPackagesResponse.map((taggedPackage) => (
        <TaggedPackageItem
          key={taggedPackage._id}
          taggedPackage={taggedPackage}
        />
      ))}
    </CommonCarousel>
  );
};

export default TaggedCarousel;
