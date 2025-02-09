"use client";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import CommonCarousel from "../../commons/Carousel";

export default function Carousel({ items }) {
  return (
    <div className="relative w-full h-[15vh] md:h-[64vh]">
      <div className="h-full w-full">
        <CommonCarousel desktopItems={1}>
          {items.map((item, index) => {
            return (
              <Image
                key={index}
                src={urlForImage(item)}
                priority
                fill
                alt="Slider"
              />
            );
          })}
        </CommonCarousel>
      </div>
    </div>
  );
}
