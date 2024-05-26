import React from "react";

const PkgGridHeader = ({
  searchParams: { arrivalCity, departureCity, departureDate },
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between">
      <div className="text-md md:text-xl">
        Paquetes a {arrivalCity} en {departureDate} desde {departureCity}
      </div>
      <div className="flex flex-col md:flex-row gap-2 items-center text-md">
        <span>Se han encontrado 14 productos.</span>
        <select
          className="p-2 border-2 border-opacity-35"
          name="pkgGridHeaderFilters"
          id="pkgGridHeaderFilters"
        >
          <option value="priceLow">Menor precio</option>
          <option value="priceHigh">Mayor precio</option>
        </select>
      </div>
    </div>
  );
};

export default PkgGridHeader;
