import React from "react";
import AsyncSelect from "react-select/async";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CitiesService from "../../../../../services/cities.service";
import { FLIGHTS_ACTIONS } from "../flightsReducer";

const getCitiesAutocompleteApi = async (query, inputName) =>
  await CitiesService.getCitiesAutocompleteApi(query, inputName);

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    height: "48px",
    borderRadius: "0.5rem",
    borderColor: state.selectProps.hasError ? "#ef4444" : "#e5e7eb",
    backgroundColor: "white",
    "&:hover": { borderColor: state.selectProps.hasError ? "#ef4444" : "#9333ea" },
    boxShadow: state.selectProps.hasError ? "0 0 0 1px #ef4444" : base.boxShadow,
  }),
  valueContainer: (base) => ({
    ...base,
    height: "46px",
    padding: "0 12px",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "46px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#374151",
  }),
};

const InputGroup = ({
  origin,
  destination,
  startDate,
  endDate,
  tripType,
  dispatch,
  errors = {},
  clearFieldError = () => {},
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
      {/* Origen - 4 columnas en desktop */}
      <div className="lg:col-span-4 space-y-1">
        <label
          htmlFor="origin"
          className="block text-sm font-medium text-white"
        >
          Origen
        </label>
        <div className="h-12">
          <AsyncSelect
            id="origin"
            instanceId="flights-origin-select"
            placeholder="¿Desde dónde?"
            loadOptions={(inputValue, callback) =>
              loadOptions(inputValue, callback, "origin")
            }
            onChange={(option) => {
              dispatch({ type: FLIGHTS_ACTIONS.SET_ORIGIN, payload: option?.value || "" });
              clearFieldError("origin");
            }}
            defaultOptions
            cacheOptions
            isClearable
            styles={selectStyles}
            hasError={!!errors.origin}
          />
        </div>
        {errors.origin && (
          <p className="text-red-400 text-xs mt-1">{errors.origin}</p>
        )}
      </div>

      {/* Destino - 4 columnas en desktop */}
      <div className="lg:col-span-4 space-y-1">
        <label
          htmlFor="destination"
          className="block text-sm font-medium text-white"
        >
          Destino
        </label>
        <div className="h-12">
          <AsyncSelect
            id="destination"
            instanceId="flights-destination-select"
            placeholder="¿Hacia dónde?"
            loadOptions={(inputValue, callback) =>
              loadOptions(inputValue, callback, "destination")
            }
            onChange={(option) => {
              dispatch({ type: FLIGHTS_ACTIONS.SET_DESTINATION, payload: option?.value || "" });
              clearFieldError("destination");
            }}
            defaultOptions
            cacheOptions
            isClearable
            styles={selectStyles}
            hasError={!!errors.destination}
          />
        </div>
        {errors.destination && (
          <p className="text-red-400 text-xs mt-1">{errors.destination}</p>
        )}
      </div>

      {/* Fechas - 3 columnas en desktop (más compacto) */}
      <div className="lg:col-span-3 space-y-1">
        <label
          htmlFor="dateRange"
          className="block text-sm font-medium text-white"
        >
          {tripType === "oneWay" ? "Fecha de ida" : "Fechas"}
        </label>
        <div className="h-12">
          <DatePicker
            selectsRange={tripType !== "oneWay"}
            selected={tripType === "oneWay" ? startDate : undefined}
            startDate={tripType !== "oneWay" ? startDate : undefined}
            endDate={tripType !== "oneWay" ? endDate : undefined}
            onChange={(update) => {
              handleDateChange(update);
              clearFieldError("startDate");
              clearFieldError("endDate");
            }}
            isClearable
            placeholderText={tripType === "oneWay" ? "Seleccione fecha" : "Ida - Vuelta"}
            className={`w-full h-12 px-4 rounded-lg border shadow-sm focus:ring-1 text-gray-700 bg-white ${
              errors.startDate || errors.endDate
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            }`}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            wrapperClassName="w-full"
          />
        </div>
        {(errors.startDate || errors.endDate) && (
          <p className="text-red-400 text-xs mt-1">{errors.startDate || errors.endDate}</p>
        )}
      </div>
    </div>
  );
};

export default InputGroup;
