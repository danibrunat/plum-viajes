import React from "react";
import Dates from "../../../../services/dates.service";
import Link from "next/link";
import Image from "next/image";

export default function LandingGridItem({ product, destination }) {
  const imageUrl =
    destination?.images.length > 0
      ? destination?.images[0]
      : "/images/imageNotFound.png";

  const generateAvailUrl = (destination) =>
    `/${product}/avail?arrivalCity=${destination.iata_code}&departureCity=BUE&startDate=${Dates.get().toFormat("YYYY-MM-DD")}&endDate=${Dates.getWithAddMonths(1).toFormat("YYYY-MM-DD")}&occupancy=2`;
  return (
    <div
      key={destination.id}
      aria-label="Grilla de destinos"
      className="w-full h-56 flex flex-col gap-1 bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 py-1"
    >
      <Link
        href={generateAvailUrl(destination)}
        target="_blank"
        rel="noopener"
        className="absolute opacity-0 top-0 right-0 left-0 bottom-0"
      />
      <div className="relative w-full h-40">
        <Image
          fill
          className="rounded-2xl w-full object-cover transition-transform duration-300 transform group-hover:scale-105"
          src={imageUrl}
          loading="lazy"
          alt={"City name"}
        />
        <Link
          className="flex justify-center items-center absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
          href={generateAvailUrl(destination)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {destination.name}
        </Link>
      </div>
      <h3 className="font-medium text-lg text-center my-auto leading-7">
        {destination.name}
      </h3>
    </div>
  );
}
