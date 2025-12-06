import React from "react";
import { FLIGHTS_ACTIONS } from "../flightsReducer";

const OptionsPanel = ({
  tripType,
  flexible,
  business,
  priceInUsd,
  dispatch,
}) => {
  const tripTypes = [
    { value: "roundTrip", label: "Ida y vuelta" },
    { value: "oneWay", label: "Solo ida" },
    { value: "multi", label: "Multi destino" },
  ];

  const checkboxOptions = [
    { key: "flexible", label: "Fechas flexibles", checked: flexible, action: FLIGHTS_ACTIONS.SET_FLEXIBLE },
    { key: "business", label: "Clase business", checked: business, action: FLIGHTS_ACTIONS.SET_BUSINESS },
    { key: "priceInUsd", label: "Precio en USD", checked: priceInUsd, action: FLIGHTS_ACTIONS.SET_PRICE_IN_USD },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Tipo de viaje - Pills/Tabs */}
      <div className="flex flex-wrap gap-2">
        {tripTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => dispatch({ type: FLIGHTS_ACTIONS.SET_TRIP_TYPE, payload: type.value })}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
              tripType === type.value
                ? "bg-white text-plumPrimaryPurple shadow-md"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Opciones adicionales - Checkboxes en línea */}
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {checkboxOptions.map((option) => (
          <label key={option.key} className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={option.checked}
              onChange={(e) => dispatch({ type: option.action, payload: e.target.checked })}
              className="w-4 h-4 rounded border-white/50 bg-white/10 text-plumPrimaryOrange focus:ring-plumPrimaryOrange focus:ring-offset-0"
            />
            <span className="ml-2 text-sm text-white/90 group-hover:text-white">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default OptionsPanel;
