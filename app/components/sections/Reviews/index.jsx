import Image from "next/image";
import React from "react";
import { urlForImage } from "../../../../sanity/lib/image";

const Reviews = ({ image }) => {
  return (
    <div className="hidden md:flex md:justify-center md:w-auto">
      <Image src={urlForImage(image)} width={1200} height={300} alt="reviews" />
    </div>
  );
};

export default Reviews;
