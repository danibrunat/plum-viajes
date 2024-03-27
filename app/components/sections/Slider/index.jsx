"use client";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Slider from "@madzadev/image-slider";
import "@madzadev/image-slider/dist/index.css";
import { useWindowSize } from "@/app/hooks/useWindowSize";

import {
  MOBILE_DEFAULT_BREAKPOINT,
  MOBILE_SLIDER_DEFAULT_HEIGHT,
  SLIDER_DEFAULT_HEIGHT,
} from "../../../constants/site";
import { memo } from "react";

export default function Carousel({ items }) {
  const imageGalleryItems = items?.map((item) => ({
    url: urlForImage(item),
  }));
  const { width } = useWindowSize();

  const sliderHeight = memo(
    width > MOBILE_DEFAULT_BREAKPOINT
      ? SLIDER_DEFAULT_HEIGHT
      : MOBILE_SLIDER_DEFAULT_HEIGHT
  );
  return (
    <Slider
      imageList={imageGalleryItems}
      width={"100%"}
      height={sliderHeight}
      loop={true}
      autoPlay={true}
      autoPlayInterval={3000}
      showArrowControls={true}
      showDotControls={false}
    />
  );
}
