"use client";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import {
  MOBILE_DEFAULT_BREAKPOINT,
  MOBILE_SLIDER_DEFAULT_HEIGHT,
  SLIDER_DEFAULT_HEIGHT,
} from "../../../constants/site";

export default function Carousel({ items }) {
  return (
    <div className={`relative w-full h-[15vh] md:h-[64vh]`}>
      <Image src={urlForImage(items[0])} priority fill alt="Slider" />
    </div>
  );
}
