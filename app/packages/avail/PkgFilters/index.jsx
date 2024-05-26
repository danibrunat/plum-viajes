import React from "react";
import PkgFilterItem from "./PkgFilterItem";

const PkgFilters = ({ filters }) => {
  return (
    <aside className="hidden p-3 my-2 md:flex md:flex-col md:w-1/4 text-plumPrimaryPink border border-opacity-35 rounded-lg">
      <h1 className="text-xl">Filtros</h1>
      {filters.map((item) => (
        <PkgFilterItem key={item.id} item={item} />
      ))}
    </aside>
  );
};

export default PkgFilters;
