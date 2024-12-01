// components/FilterCheckbox.jsx
"use client"; // Esto convierte este componente en un componente del lado del cliente

import React from "react";
import { FilterClientService } from "../../../../../../services/filters.service";

export default function FilterCheckbox({ filterId, value, checked, children }) {
  const handleChange = (e) =>
    FilterClientService.handleFilterChange(e, filterId, value);

  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={handleChange}
        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
      />
      <span className="text-gray-700">{children}</span>
    </label>
  );
}
