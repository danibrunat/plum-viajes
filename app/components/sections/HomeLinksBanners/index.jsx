"use client";
import Image from "next/image";
import React from "react";
import { urlForImage } from "../../../../sanity/lib/image";
import Link from "next/link";
import { useWindowSize } from "../../../hooks/useWindowSize";

export default function HomeLinksBanners(imageLinks) {
  const links = imageLinks?.content;
  const { width: viewPortwith } = useWindowSize();
  console.log("imageLinks", imageLinks);

  /*  if (viewPortwith < 768) {
    return "Esto es mobile";
  }
 */
  return (
    <div className="flex gap-1 py-0 mx-2 md:py-5 md:mx-16 md:gap-3 overflow-scroll md:overflow-visible md:justify-center lg:justify-center">
      {links.map((il) => (
        <div key={il._key} className="shrink-0 md:shrink ">
          <Link href={il.link}>
            <Image
              src={urlForImage(il.image)}
              alt={il.title}
              width={250}
              loading="lazy"
              height={100}
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
