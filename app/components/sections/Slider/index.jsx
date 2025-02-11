"use client";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import CommonCarousel from "../../commons/Carousel";

export default function Carousel({ items }) {
  return (
    <div className="relative w-full h-[15vh] md:h-[64vh]">
      <CommonCarousel desktopItems={1} itemClass="p-0">
        {items.map((item, index) => (
          <div key={index} className="relative w-full h-[15vh] md:h-[64vh]">
            <Image
              src={urlForImage(item)}
              priority
              fill
              className="object-cover"
              alt="Slider"
            />
          </div>
        ))}
      </CommonCarousel>
    </div>
  );
}
