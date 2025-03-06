import React from "react";

const SearchButton = () => {
  return (
    <button
      type="submit"
      className="col-span-2 lg:col-span-1 p-3 bg-plumPrimaryOrange text-white font-semibold rounded-md hover:bg-indigo-700"
    >
      Buscar vuelos
    </button>
  );
};

export default SearchButton;
