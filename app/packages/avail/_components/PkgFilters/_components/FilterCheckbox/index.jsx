// components/FilterCheckbox.jsx
"use client"; // Esto convierte este componente en un componente del lado del cliente

import React from "react";

export default function FilterCheckbox({ filterId, value, checked, children }) {
  const handleChange = (e) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (e.target.checked) {
      params.append(filterId, value);
    } else {
      const values = params.getAll(filterId).filter((v) => v !== value);
      params.delete(filterId);
      values.forEach((v) => params.append(filterId, v));
    }

    url.search = params.toString();
    window.location.href = url.toString();
  };

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
