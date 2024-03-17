"use client";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import { useState } from "react";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";
export default function Carousel({ items }) {
  let [current, setCurrent] = useState(0);

  let previousSlide = () => {
    if (current === 0) setCurrent(items.length - 1);
    else setCurrent(current - 1);
  };

  let nextSlide = () => {
    if (current === items.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  };

  return (
    <div className="overflow-hidden relative">
      <div
        className={`flex w-full transition ease-out duration-40`}
        style={{
          transform: `translateX(-${current * 100}%)`,
          height: "600px",
        }}
      >
        {items.map((slide) => {
          return (
            <Image
              key={slide._key}
              fill
              src={urlForImage(slide)}
              alt="un alt"
            />
          );
        })}
      </div>

      <div className="absolute top-0 h-full w-full justify-between items-center flex text-white px-10 text-3xl">
        <button onClick={previousSlide}>
          <BsFillArrowLeftCircleFill size={"3em"} />
        </button>
        <button onClick={nextSlide}>
          <BsFillArrowRightCircleFill size={"3em"} />
        </button>
      </div>

      <div className="absolute bottom-0 py-4 flex justify-center gap-3 w-full">
        {items.map((s, i) => {
          return (
            <div
              onClick={() => {
                setCurrent(i);
              }}
              key={"circle" + i}
              className={`rounded-full w-5 h-5 cursor-pointer  ${
                i == current ? "bg-white" : "bg-gray-500"
              }`}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
