import Image from "next/image";
import React from "react";
import { urlForImage } from "../../../../../sanity/lib/image";
import {
  sanitizeHtmlString,
  sanitizeUrlFromDoubleSlash,
} from "../../../../helpers/strings";

const getDepartureLowestPrice = (departures) => {
  if (departures.length === 0) return "Consulte";
  if (!departures[0].prices.length > 0) return "Consulte";
  const departureLowestPrice = departures[0]?.prices[0]?.amount;

  return `$ ${departureLowestPrice}`;
};

const getHotelRating = (departure) => {
  return (
    <div className="flex items-center">
      <svg
        aria-hidden="true"
        className="h-5 w-5 text-yellow-300"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
      <svg
        aria-hidden="true"
        className="h-5 w-5 text-yellow-300"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
      <svg
        aria-hidden="true"
        className="h-5 w-5 text-yellow-300"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
      {/*  <svg
    aria-hidden="true"
    className="h-5 w-5 text-yellow-300"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
  </svg>
  <svg
    aria-hidden="true"
    className="h-5 w-5 text-yellow-300"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
  </svg> */}
    </div>
  );
};

const getHotels = (departures) => {
  if (departures.length === 0) return departures;
  return departures[0].hotels;
};

const PkgGridItem = ({ pkgItem, departureCity }) => {
  const departures = pkgItem && pkgItem.departures ? pkgItem.departures : [];
  const lowestPrice = getDepartureLowestPrice(departures);
  const hotelRating = getHotelRating(departures);
  const hotels = getHotels(departures);
  const imgSource = pkgItem?.images
    ? urlForImage(pkgItem?.images[0])
    : sanitizeUrlFromDoubleSlash(
        pkgItem?.thumbnails[
          Math.floor(Math.random() * pkgItem?.thumbnails.length)
        ]
      );
  return (
    <div className="flex flex-col md:flex-row md:justify-between w-full m-2 mx-auto p-1 md:p-2 h-fit overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
      <div className="flex relative h-52 md:h-40 w-full md:w-72 md:overflow-hidden rounded-xl">
        <Image
          className="rounded-xl hover:scale-110 transition-all duration-500"
          fill
          src={
            imgSource && imgSource.length !== 0 ? imgSource : "/no-image.jpeg"
          }
          alt="Paquete"
        />
        <span className="absolute top-0 left-0 m-2 rounded-full bg-plumPrimaryPink px-2 text-center text-sm font-medium text-white">
          Hot Sale
        </span>
      </div>
      <div className="flex md:grow flex-col justify-start gap-1 p-2 mx-2 w-full md:w-2/5 text-plumPrimaryPink text-xs">
        <h5 className="tracking-tight font-bold text-sm ">
          {pkgItem?.title ?? "Default Title"}
        </h5>
        <em className="text-black">Salidas de Mayo a Junio</em>
        <span>{sanitizeHtmlString(pkgItem?.subtitle)}</span>
        <span>
          {pkgItem?.nights} noches desde {departureCity}
        </span>
        <div className="flex gap-2">
          {hotels} {hotelRating}{" "}
          <em className="text-slate-800">All Inclusive</em>
        </div>
      </div>
      <div className="flex flex-col items-center text-center gap-1 md:w-1/4 md:my-5 border-l-0 md:border-l-2 text-plumPrimaryPink">
        <div className="flex flex-col">
          <em className="text-xs">Desde</em>
          <span className="text-xl font-bold">{lowestPrice}</span>
        </div>
        {/* <span className="text-sm text-slate-900 line-through">$699</span> */}
        <a
          href="#"
          className="flex items-center justify-center rounded-xl bg-plumPrimaryPink hover:bg-plumSecondaryPink transition-all duration-500 px-5 py-2 md:py-2.5 text-center text-xs font-medium text-white hover:bg-plumPrimaryPink-500"
        >
          Ver paquete
        </a>
        <div className="flex flex-col text-xs">
          <em>Precio por persona</em>
          <em>Base doble</em>
        </div>
      </div>
    </div>
  );
};

export default PkgGridItem;
