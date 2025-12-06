import React from "react";

const SearchButton = () => {
  return (
    <button
      type="submit"
      className="flex-1 sm:flex-none px-8 py-3 bg-plumPrimaryOrange text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      Buscar vuelos
    </button>
  );
};

export default SearchButton;
