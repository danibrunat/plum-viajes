"use client";
import Image from "next/image";
import CommonCarousel from "../../commons/Carousel";
import { urlForImage } from "../../../lib/image";
import { sanityImageLoader } from "./imageLoader";

export default function Carousel({ items }) {
  return (
    <div className="relative w-full h-[15vh] md:h-[64vh]">
      <CommonCarousel desktopItems={1} itemClass="p-0">
        {items.map((item, index) => (
          <div key={index} className="relative w-full h-[15vh] md:h-[64vh]">
            <Image
              src={urlForImage(item)}
              loader={sanityImageLoader}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              fill
              sizes="100vw"
              className="object-cover"
              alt="Slider"
            />
          </div>
        ))}
      </CommonCarousel>
    </div>
  );
}
