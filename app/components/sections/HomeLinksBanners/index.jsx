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
    <div className="flex gap-3 justify-center py-5 mx-16">
      {links.map((il) => (
        <div key={il._key} className="w-auto sm:w-full">
          <Link href={il.link}>
            <Image
              src={urlForImage(il.image)}
              alt={il.title}
              width={150}
              height={80}
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
