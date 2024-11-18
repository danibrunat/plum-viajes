// components/Filters.jsx (SSR y CSR)
import React from "react";
import FilterCheckbox from "./_components/FilterCheckbox"; // Componente de checkbox interactivo

export default function PkgFilters({ filters, currentSearchParams }) {
  console.log("PkgFilters | filters: ", JSON.stringify(filters));
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Filtros</h2>
      {filters.map((filter) => (
        <div key={filter.id} className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {filter.title}
          </h3>
          <div className="space-y-2">
            {filter.items.map((item) => (
              <FilterCheckbox
                key={item.value}
                filterId={filter.id}
                value={item.value}
                checked={currentSearchParams[filter.id]?.includes(item.value)}
              >
                {item.label}
              </FilterCheckbox>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
