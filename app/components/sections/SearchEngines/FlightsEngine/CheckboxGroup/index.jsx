import React from "react";

const CheckboxGroup = ({
  flexibleDates,
  setFlexibleDates,
  business,
  setBusiness,
  priceInUsd,
  setPriceInUsd,
}) => {
  return (
    <div className="flex flex-col gap-2 lg:col-span-1">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={flexibleDates}
          onChange={(e) => setFlexibleDates(e.target.checked)}
          className="h-4 w-4  border-gray-300 rounded"
        />
        <span className="ml-2 text-white  ">Fechas flexibles</span>
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={business}
          onChange={(e) => setBusiness(e.target.checked)}
          className="h-4 w-4  border-gray-300 rounded"
        />
        <span className="ml-2 text-white">Clase business</span>
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={priceInUsd}
          onChange={(e) => setPriceInUsd(e.target.checked)}
          className="h-4 w-4  border-gray-300 rounded"
        />
        <span className="ml-2 text-white">Precio en USD</span>
      </label>
    </div>
  );
};

export default CheckboxGroup;
