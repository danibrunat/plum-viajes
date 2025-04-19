import Image from "next/image";
import React from "react";
import { sanitizeUrlFromDoubleSlash } from "../../../../../helpers/strings";
import { Helpers } from "../../../../../services/helpers.service";
import Formatters from "../../../../../services/formatters.service";
import Link from "next/link";
import PackageService from "../../../../../services/package.service";
import { FLOW_STAGES } from "../../../../../constants/site";
import { urlForImage } from "../../../../../lib/image";
import HotelInfo from "./HotelInfo";

// Simplificada y optimizada
const getImgSource = (pkgItem, provider) => {
  const defaultImage = "/images/imageNotFound.jpg";

  if (!pkgItem?.thumbnails || pkgItem.thumbnails.length === 0)
    return defaultImage;

  try {
    if (provider === "plum" && pkgItem.thumbnails[0]?.sourceUrl) {
      return urlForImage(pkgItem.thumbnails[0].sourceUrl);
    }

    if (provider === "ola" && pkgItem.thumbnails.length > 0) {
      const randomIndex = Math.floor(Math.random() * pkgItem.thumbnails.length);
      const url = pkgItem.thumbnails[randomIndex]?.sourceUrl;
      return url ? sanitizeUrlFromDoubleSlash(url) : defaultImage;
    }
  } catch (error) {
    console.error("Error getting image source:", error);
  }

  return defaultImage;
};

// Main package grid item component (server component)
const PkgGridItem = ({ pkgItem, searchParams }) => {
  const { departureCity, arrivalCity, startDate, endDate, occupancy } =
    searchParams;

  // Direct calculations instead of using useMemo
  const hotels = pkgItem?.departures[0]?.hotels || [];

  const pkgPrice = PackageService.prices.getPkgPrice(
    pkgItem?.departures[0]?.prices,
    FLOW_STAGES.PKG_AVAILABILITY
  );

  const provider = pkgItem?.provider;
  const imgSource = getImgSource(pkgItem, provider);

  const isSoldOutDeparture =
    (pkgItem?.departures.length === 1 && pkgItem?.departures[0].seats === 0) ||
    pkgItem?.departures.every((departure) => departure.seats === 0);

  const priceId = pkgItem?.departures[0]?.prices?.id;
  const firstDepartureDate = pkgItem?.departures[0]?.date;
  const slug = Helpers.slugify(pkgItem?.title);
  const detailUrl = `/packages/detail?name=${slug}&id=${pkgItem?.id}&provider=${provider}&occupancy=${occupancy}&departureCity=${departureCity}&arrivalCity=${arrivalCity}&startDate=${firstDepartureDate}&endDate=${endDate}&priceId=${priceId}`;

  return (
    <div className="flex flex-col md:flex-row md:justify-between w-full m-2 mx-auto p-1 md:p-2 h-fit overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
      {/* Image section */}
      <div className="flex relative h-52 md:h-40 w-full md:w-72 md:overflow-hidden rounded-xl">
        <Image
          className="rounded-xl hover:scale-110 transition-all duration-500"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={
            imgSource && imgSource.length !== 0
              ? imgSource
              : "/images/no-image.jpeg"
          }
          alt="Paquete"
          unoptimized={imgSource.startsWith("http")}
          placeholder="blur"
          blurDataURL="/images/no-image.jpeg"
          loading="lazy"
        />
        <div className="absolute top-0 left-0 m-2 flex space-x-2">
          {pkgItem?.specialOfferTags && (
            <span className="rounded-full bg-plumPrimaryPurple px-2 text-center text-sm font-medium text-white">
              {`${pkgItem?.specialOfferTags}`}
            </span>
          )}
          {isSoldOutDeparture && (
            <span className="rounded-full bg-red-600 px-2 text-center text-sm font-medium text-white">
              Agotado
            </span>
          )}
        </div>
      </div>

      {/* Package and hotels information */}
      <div className="flex md:grow flex-col justify-start gap-1 p-2 mx-2 w-full md:w-2/5 text-xs">
        <h5 className="tracking-tight font-bold text-sm ">
          {pkgItem?.title ?? "Default Title"}
        </h5>
        <span className="text-sm">
          {pkgItem?.nights} noches desde {departureCity}
        </span>
        <div className="flex flex-col gap-1 py-3">
          {hotels.map((hotel, index) => (
            <HotelInfo key={hotel.id || index} hotel={hotel} index={index} />
          ))}
        </div>
      </div>

      {/* Price and CTA section */}
      <div className="flex flex-col items-center text-center gap-1 md:w-1/4 md:my-5 border-l-0 md:border-l-2">
        <div className="flex flex-col">
          <em className="text-xs">Desde</em>
          <span className="text-xl font-bold">
            {`${Formatters.price(pkgPrice.finalPrice, pkgPrice.currency)}`}
          </span>
        </div>

        <Link
          href={detailUrl}
          className="flex items-center justify-center rounded-xl bg-plumPrimaryPurple hover:bg-plumSecondaryPink transition-all duration-500 px-5 py-2 md:py-2.5 text-center text-xs font-medium text-white hover:bg-plumPrimaryPurple-500"
        >
          Ver paquete
        </Link>
        <div className="flex flex-col text-xs">
          <em>Precio por persona</em>
          <em>Base doble</em>
        </div>
      </div>
    </div>
  );
};

export default PkgGridItem;
