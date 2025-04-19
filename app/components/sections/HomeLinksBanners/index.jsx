import Image from "next/image";
import React from "react";
import { urlForImage } from "../../../lib/image";
import Link from "next/link";
import CommonCarousel from "../../commons/Carousel";

export default function HomeLinksBanners(imageLinks) {
  const links = imageLinks?.content || [];

  // Si no hay links, no renderizar nada
  if (!links.length) return null;

  // Componente para cada banner, evitando duplicación de código
  const BannerLink = ({ item, index, isMobile = false }) => (
    <Link
      href={item.link}
      aria-label={`Ver ofertas de ${item.title || "destino"}`}
    >
      <Image
        src={urlForImage(item.image)}
        alt={item.title || "Imagen promocional de destino turístico"}
        {...(isMobile
          ? { fill: true, className: "object-cover w-full h-full" }
          : {
              width: 250,
              height: 100,
              className: "object-cover w-full h-full",
            })}
        loading={index === 0 ? "eager" : "lazy"}
      />
    </Link>
  );

  return (
    <>
      <div className="hidden md:flex gap-3 py-0 mx-2 md:py-5 md:mx-16 md:gap-5 overflow-scroll md:overflow-visible md:justify-center lg:justify-center">
        {links.map((il, index) => (
          <div key={il._key} className="shrink-0 md:shrink w-full md:w-1/5">
            <BannerLink item={il} index={index} />
          </div>
        ))}
      </div>

      <div className="lg:hidden">
        <CommonCarousel>
          {links.map((il, index) => (
            <div key={il._key} className="w-full h-72 p-5">
              <BannerLink item={il} index={index} isMobile={true} />
            </div>
          ))}
        </CommonCarousel>
      </div>
    </>
  );
}
