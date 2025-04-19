import Image from "next/image";
import React from "react";
import { urlForImage } from "../../../lib/image";
import Link from "next/link";
import CommonCarousel from "../../commons/Carousel";

export default function HomeLinksBanners(imageLinks) {
  const links = imageLinks?.content;

  return (
    <>
      <div className="hidden md:flex gap-3 py-0 mx-2 md:py-5 md:mx-16 md:gap-5 overflow-scroll md:overflow-visible md:justify-center lg:justify-center">
        {links.map((il, index) => (
          <div key={il._key} className="shrink-0 md:shrink w-full md:w-1/5">
            <Link
              href={il.link}
              aria-label={`Ver ofertas de ${il.title || "destino"}`}
            >
              <Image
                src={urlForImage(il.image)}
                alt={il.title || "Imagen promocional de destino turístico"}
                width={250}
                height={100}
                className="object-cover w-full h-full"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </Link>
          </div>
        ))}
      </div>
      <div className="lg:hidden">
        <CommonCarousel>
          {links.map((il, index) => (
            <div key={il._key} className="w-full h-72 p-5">
              <Link
                href={il.link}
                aria-label={`Ver ofertas de ${il.title || "destino"}`}
              >
                <Image
                  src={urlForImage(il.image)}
                  alt={il.title || "Imagen promocional de destino turístico"}
                  fill
                  className="object-cover w-full h-full"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </Link>
            </div>
          ))}
        </CommonCarousel>
      </div>
    </>
  );
}
