import React from "react";
import LandingGridItem from "../LandingGridItem";
import Link from "next/link";
import Image from "next/image";

export default function LandingGrid({ product, destination }) {
  const destinations = [
    {
      id: 1531,
      name: "Bogotá",
      slug: "bogota",
      description: `<p>En la regi&oacute;n occidental de la Isla Sur de&nbsp;<a href="http…"`,
      longDescription: "",
      active: 1,
      origin: "0",
      countryName: "Colombia",
      regionName: "America",
      image: "https://source.unsplash.com/random/300/?bogota",
    },
    {
      id: 1531,
      name: "Buenos Aires",
      slug: "buenos-aires",
      description: `<p>En la regi&oacute;n occidental de la Isla Sur de&nbsp;<a href="http…"`,
      longDescription: "",
      active: 1,
      origin: "0",
      countryName: "Argentina",
      regionName: "America",
      image: "https://source.unsplash.com/random/300/?Buenos%20Aires",
    },
  ];
  return (
    <div className="p-2 container mx-auto">
      <div className="md:grid md:gap-3 md:grid-cols-2 lg:grid-cols-6 mb-12">
        {destinations.map((destination) => {
          return (
            <>
              <article
                key={destination.comment}
                className="p-6 mb-6  transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer"
              >
                <Link
                  href={`/${product}/${destination.slug}`}
                  target="_blank"
                  rel="noopener"
                  className="absolute opacity-0 top-0 right-0 left-0 bottom-0"
                />
                <div className="relative mb-4 rounded-2xl">
                  <Image
                    width={300}
                    height={150}
                    className="rounded-2xl w-full object-cover transition-transform duration-300 transform group-hover:scale-105"
                    src={destination.image}
                    loading="lazy"
                    alt=""
                  />
                  <Link
                    className="flex justify-center items-center bg-purple-500 bg-opacity-80  absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
                    href={`/${product}/${destination.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {destination.name}
                  </Link>
                </div>
                <h3 className="font-medium text-xl text-center leading-8">
                  {destination.name}
                </h3>
              </article>
            </>
          );
        })}
      </div>
    </div>
  );
}
