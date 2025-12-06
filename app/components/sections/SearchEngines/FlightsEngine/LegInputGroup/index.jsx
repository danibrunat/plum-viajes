import React from "react";
import AsyncSelect from "react-select/async";
import CitiesService from "../../../../../services/cities.service";
import { FiTrash2 } from "react-icons/fi";
import { FLIGHTS_ACTIONS } from "../flightsReducer";

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

const selectStyles = {
  control: (base) => ({
    ...base,
    minHeight: "40px",
    borderRadius: "0.5rem",
    borderColor: "#e5e7eb",
    backgroundColor: "white",
    "&:hover": { borderColor: "#9333ea" },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "0.875rem",
  }),
};

const LegInputGroup = ({ index, leg, dispatch, canRemove }) => {
  const handleUpdateLeg = (field, value) => {
    dispatch({
      type: FLIGHTS_ACTIONS.UPDATE_LEG,
      payload: { index, field, value },
    });
  };

  const handleRemoveLeg = () => {
    dispatch({ type: FLIGHTS_ACTIONS.REMOVE_LEG, payload: index });
  };

  return (
    <div className="relative p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
      {/* Badge del número de tramo */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-plumPrimaryOrange text-white text-xs font-bold rounded-full flex items-center justify-center">
        {index + 1}
      </div>
      
      {/* Botón de eliminar */}
      {canRemove && (
        <button
          type="button"
          onClick={handleRemoveLeg}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          title="Eliminar tramo"
        >
          <FiTrash2 size={12} />
        </button>
      )}
      
      {/* Grid de campos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label
            htmlFor={`legOrigin-${index}`}
            className="block text-xs font-medium text-white/80"
          >
            Origen
          </label>
          <AsyncSelect
            id={`legOrigin-${index}`}
            instanceId={`leg-origin-${index}`}
            placeholder="¿Desde dónde?"
            loadOptions={(inputValue, callback) =>
              loadOptions(inputValue, callback, "origin")
            }
            onChange={(option) => handleUpdateLeg("origin", option?.value || "")}
            defaultOptions
            cacheOptions
            isClearable
            styles={selectStyles}
          />
        </div>
        
        <div className="space-y-1">
          <label
            htmlFor={`legDestination-${index}`}
            className="block text-xs font-medium text-white/80"
          >
            Destino
          </label>
          <AsyncSelect
            id={`legDestination-${index}`}
            instanceId={`leg-destination-${index}`}
            placeholder="¿Hacia dónde?"
            loadOptions={(inputValue, callback) =>
              loadOptions(inputValue, callback, "destination")
            }
            onChange={(option) => handleUpdateLeg("destination", option?.value || "")}
            defaultOptions
            cacheOptions
            isClearable
            styles={selectStyles}
          />
        </div>
        
        <div className="space-y-1">
          <label
            htmlFor={`legDate-${index}`}
            className="block text-xs font-medium text-white/80"
          >
            Fecha
          </label>
          <input
            type="date"
            id={`legDate-${index}`}
            value={leg.date}
            onChange={(e) => handleUpdateLeg("date", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
};

export default LegInputGroup;
