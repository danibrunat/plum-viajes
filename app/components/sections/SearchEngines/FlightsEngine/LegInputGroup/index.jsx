import React from "react";
import AsyncSelect from "react-select/async";
import { CitiesService } from "../../../../../services/cities.service";
import { FiTrash2 } from "react-icons/fi";

const getCitiesAutocompleteApi = async (query, inputName) =>
  await CitiesService.getCitiesAutocompleteApi(query, inputName);

const loadOptions = async (inputValue, _, inputName) => {
  if (inputValue.length < 4) {
    return [];
  }
  try {
    const citiesFetch = await getCitiesAutocompleteApi(inputValue, inputName);
    const formattedOptions = citiesFetch.map((city) => ({
      label: `${city.label}`,
      value: city.value,
    }));
    return formattedOptions;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};

const LegInputGroup = ({ index, leg, updateLeg, removeLeg }) => {
  return (
    <div className="flex-1 w-full p-3 border rounded-md bg-gray-800 mb-3 relative items-center">
      {/* Botón de eliminar tramo en la esquina superior derecha */}
      {removeLeg && (
        <button
          type="button"
          onClick={() => removeLeg(index)}
          className="absolute top-2 right-2 text-red-500 hover:text-red-600"
          title="Eliminar tramo"
        >
          <FiTrash2 size={18} />
        </button>
      )}
      {/* Contenedor responsivo: vertical en mobile, horizontal en md+ */}
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="flex-1 mb-3 md:mb-0">
          <label
            htmlFor={`legOrigin-${index}`}
            className="block text-xs font-medium text-white mb-1"
          >
            Origen
          </label>
          <AsyncSelect
            id={`legOrigin-${index}`}
            placeholder="Origen"
            loadOptions={(inputValue, callback) =>
              loadOptions(inputValue, callback, "origin")
            }
            onChange={(option) => updateLeg(index, "origin", option.value)}
            defaultOptions
            cacheOptions
            className="mt-1"
          />
        </div>
        <div className="flex-1 mb-3 md:mb-0">
          <label
            htmlFor={`legDestination-${index}`}
            className="block text-xs font-medium text-white mb-1"
          >
            Destino
          </label>
          <AsyncSelect
            id={`legDestination-${index}`}
            placeholder="Destino"
            loadOptions={(inputValue, callback) =>
              loadOptions(inputValue, callback, "destination")
            }
            onChange={(option) => updateLeg(index, "destination", option.value)}
            defaultOptions
            cacheOptions
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor={`legDate-${index}`}
            className="block text-xs font-medium text-white mb-1"
          >
            Fecha
          </label>
          <input
            type="date"
            id={`legDate-${index}`}
            value={leg.date}
            onChange={(e) => updateLeg(index, "date", e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default LegInputGroup;
