"use client";
import React from "react";
import { addOrUpdateParamInUrl } from "../../../../../../utils/urls";

const PkgGridHeader = ({
  searchParams: { arrivalCity, departureCity, departureDate, priceOrder },
  packagesQty,
}) => {
  const handleFilterChange = (e) => {
    addOrUpdateParamInUrl("priceOrder", e.target.value);
  };
  const pkgFoundLabel = `Se han encontrado ${packagesQty} productos.`;
  return (
    <div className="flex flex-col md:flex-row md:justify-between">
      <div className="text-md md:text-xl">
        Paquetes a {arrivalCity} en {departureDate} desde {departureCity}
      </div>
      <div className="flex flex-col md:flex-row gap-2 items-center text-md">
        <span>{pkgFoundLabel}</span>
        <select
          className="p-2 border-2 border-opacity-35"
          name="pkgGridHeaderFilters"
          id="pkgGridHeaderFilters"
          defaultValue={priceOrder}
          onChange={handleFilterChange}
        >
          <option id="price-order" value="low">
            Menor precio
          </option>
          <option id="price-order" value="high">
            Mayor precio
          </option>
        </select>
      </div>
    </div>
  );
};

export default PkgGridHeader;
