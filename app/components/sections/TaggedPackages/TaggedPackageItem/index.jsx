import Image from "next/image";
import React from "react";
import { sanitizeUrlFromDoubleSlash } from "../../../../helpers/strings";
import { urlForImage } from "../../../../../sanity/lib/image";
import Dates from "../../../../services/dates.service";
import Formatters from "../../../../services/formatters.service";

function getPkgPrice(departures) {
  // order by price
  const orderedDepartures = departures.sort(
    (a, b) => a.prices[0].amount - b.prices[0].amount
  );

  const lowestPrice = Math.ceil(orderedDepartures[0].prices[0].amount);
  return Formatters.price(lowestPrice, "ARS");
}

const TaggedPackageItem = ({ taggedPackage }) => {
  const { title, provider, thumbnail, price, currency, nights, packageId } =
    taggedPackage;

  const pkgPrice =
    provider === "ola"
      ? Formatters.price(price, currency)
      : getPkgPrice(taggedPackage.departures);
  const imgSrc =
    provider === "ola"
      ? sanitizeUrlFromDoubleSlash(thumbnail).replace("100x70", "700x500")
      : urlForImage(taggedPackage.images[0]);

  const pkgDetailUrl = `/packages/detail?id=${packageId}&provider=${provider}&occupancy=2&departureCity=BUE&arrivalCity=IGR&startDate=${Dates.get().toFormat("YYYY-MM-DD")}&endDate=${Dates.getWithAddMonths(6).toFormat("YYYY-MM-DD")}`;

  return (
    <div className="flex flex-col card cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-b-lg">
      {/* Contenedor de imagen */}
      <div className="relative rounded-b-lg h-64">
        <Image src={imgSrc} className="rounded-lg" fill alt={title} />
        <div className="absolute inset-0  p-4 text-white">
          <div className="degrade">
            <div className="font-semibold text-lg"></div>
            <div className="text-lg font-bold">{title}</div>
            <div className="prod-noches mt-2">{nights} noches</div>
          </div>
        </div>
      </div>

      {/* Cuerpo de la card */}
      <div className=" bg-white p-4 rounded-b-lg">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-500 text-sm">desde</span>
            <br />
            <span className="valor text-md font-bold">{pkgPrice}</span>
            <br />
            <span className="text-gray-500 text-sm">Base Doble</span>
          </div>
          <div>
            <a
              href={pkgDetailUrl}
              className="btn btn-primary bg-plumPrimaryOrange text-white px-4 py-2 rounded hover:bg-plumPrimaryPurple text-sm"
            >
              Ver paquete
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaggedPackageItem;
