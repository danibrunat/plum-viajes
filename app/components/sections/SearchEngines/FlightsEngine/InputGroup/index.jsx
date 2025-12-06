import React from "react";
import AsyncSelect from "react-select/async";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CitiesService from "../../../../../services/cities.service";
import { FLIGHTS_ACTIONS } from "../flightsReducer";

const getCitiesAutocompleteApi = async (query, inputName) =>
  await CitiesService.getCitiesAutocompleteApi(query, inputName);

const selectStyles = {
  control: (base) => ({
    ...base,
    minHeight: "44px",
    borderRadius: "0.5rem",
    borderColor: "#e5e7eb",
    "&:hover": { borderColor: "#9333ea" },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
  }),
};

const InputGroup = ({
  origin,
  destination,
  startDate,
  endDate,
  tripType,
  dispatch,
}) => {
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

  const handleDateChange = (update) => {
    if (tripType === "oneWay") {
      dispatch({ type: FLIGHTS_ACTIONS.SET_DATE_RANGE, payload: [update, null] });
    } else {
      dispatch({ type: FLIGHTS_ACTIONS.SET_DATE_RANGE, payload: update });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Origen */}
      <div className="space-y-1">
        <label
          htmlFor="origin"
          className="block text-sm font-medium text-white"
        >
          Origen
        </label>
        <AsyncSelect
          id="origin"
          instanceId="flights-origin-select"
          placeholder="¿Desde dónde?"
          loadOptions={(inputValue, callback) =>
            loadOptions(inputValue, callback, "origin")
          }
          onChange={(option) => dispatch({ type: FLIGHTS_ACTIONS.SET_ORIGIN, payload: option?.value || "" })}
          defaultOptions
          cacheOptions
          isClearable
          styles={selectStyles}
        />
      </div>

      {/* Destino */}
      <div className="space-y-1">
        <label
          htmlFor="destination"
          className="block text-sm font-medium text-white"
        >
          Destino
        </label>
        <AsyncSelect
          id="destination"
          instanceId="flights-destination-select"
          placeholder="¿Hacia dónde?"
          loadOptions={(inputValue, callback) =>
            loadOptions(inputValue, callback, "destination")
          }
          onChange={(option) => dispatch({ type: FLIGHTS_ACTIONS.SET_DESTINATION, payload: option?.value || "" })}
          defaultOptions
          cacheOptions
          isClearable
          styles={selectStyles}
        />
      </div>

      {/* Fechas */}
      <div className={`space-y-1 ${tripType === "oneWay" ? "lg:col-span-2" : "lg:col-span-2"}`}>
        <label
          htmlFor="dateRange"
          className="block text-sm font-medium text-white"
        >
          {tripType === "oneWay" ? "Fecha de ida" : "Fechas"}
        </label>
        <DatePicker
          selectsRange={tripType !== "oneWay"}
          selected={tripType === "oneWay" ? startDate : undefined}
          startDate={tripType !== "oneWay" ? startDate : undefined}
          endDate={tripType !== "oneWay" ? endDate : undefined}
          onChange={handleDateChange}
          isClearable
          placeholderText={tripType === "oneWay" ? "Seleccione fecha" : "Ida - Vuelta"}
          className="w-full p-3 rounded-lg border border-gray-200 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-gray-700"
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
        />
      </div>
    </div>
  );
};

export default InputGroup;
