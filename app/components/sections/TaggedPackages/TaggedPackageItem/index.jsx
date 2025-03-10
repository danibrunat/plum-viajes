import Image from "next/image";
import React from "react";
import { sanitizeUrlFromDoubleSlash } from "../../../../helpers/strings";
import { urlForImage } from "../../../../../sanity/lib/image";
import Dates from "../../../../services/dates.service";
import Formatters from "../../../../services/formatters.service";
import CryptoService from "../../../../api/services/cypto.service";

function getPkgPrice(departures) {
  // order by price
  const orderedDepartures = departures.sort(
    (a, b) => a.prices[0].amount - b.prices[0].amount
  );

  const lowestPrice = Math.ceil(orderedDepartures[0].prices[0].amount);
  return Formatters.price(lowestPrice, "ARS");
}

const TaggedPackageItem = ({ taggedPackage }) => {
  const {
    title,
    provider,
    thumbnail,
    price,
    currency,
    nights,
    packageId,
    departures,
    departureId,
    destination,
  } = taggedPackage;

  const pkgId = packageId ?? taggedPackage._id; // si packageId viene es de proveedor, y si no, tomamos el _id porque es nuestro, es de plum
  const pkgProvider = provider ?? "plum"; // De la misma forma, asumimos que si no viene el provider, es nuestro, porque no corresponde al modelo de tagged packages

  const pkgPrice =
    provider === "ola"
      ? Formatters.price(price, currency)
      : getPkgPrice(taggedPackage.departures);
  const imgSrc =
    provider === "ola"
      ? sanitizeUrlFromDoubleSlash(thumbnail).replace("100x70", "700x500")
      : urlForImage(taggedPackage.images[0]);

  const startDate = Dates.get().toFormat("YYYY-MM-DD");

  // Dato para la posteridad, lo que hago acá es:
  // Dentro de useProviderPackages, estoy generando el departureId y guardandoló en el modelo. Esto es solo para providers, así que estaría bien.
  // Luego pregunto si es plum, me agarro las departures y tomo el departureFrom
  // Si es otro distinto, es un provider entonces tomo el que viene del modelo de provider packages tagged.
  const departureDateForCrypto =
    provider === "plum" ? departures[0].departureFrom : departureId;
  const urlDepartureId = CryptoService.generateDepartureId(
    provider,
    departureDateForCrypto
  );

  const pkgDetailUrl = `/packages/detail?id=${pkgId}&departureId=${urlDepartureId}&provider=${pkgProvider}&occupancy=2&departureCity=BUE&arrivalCity=${destination[0].iata_code}&startDate=${startDate}&endDate=${Dates.getWithAddMonths(6).toFormat("YYYY-MM-DD")}`;

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
