import React from "react";
import AsyncSelect from "react-select/async";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CitiesService from "../../../../../services/cities.service";

const getCitiesAutocompleteApi = async (query, inputName) =>
  await CitiesService.getCitiesAutocompleteApi(query, inputName);

const InputGroup = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  setDateRange,
  dateRange,
  startDate,
  endDate,
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

  return (
    <>
      <div className="flex-1">
        <label
          htmlFor="origin"
          className="block text-sm font-medium text-white"
        >
          Origen
        </label>
        <AsyncSelect
          className="flex-1 mt-1"
          id="origin"
          placeholder="Seleccione la ciudad de Origen"
          loadOptions={(inputValue, callback) =>
            loadOptions(inputValue, callback, "origin")
          }
          onChange={(option) => setOrigin(option.value)}
          defaultOptions
          cacheOptions
        />
      </div>
      <div className="flex-1">
        <label
          htmlFor="destination"
          className="block text-sm font-medium text-white"
        >
          Destino
        </label>
        <AsyncSelect
          className="mt-1"
          id="destination"
          placeholder="Seleccione la ciudad de llegada"
          loadOptions={(inputValue, callback) =>
            loadOptions(inputValue, callback, "destination")
          }
          onChange={(option) => setDestination(option.value)}
          defaultOptions
          cacheOptions
        />
      </div>
      <div className="flex-1">
        <label
          htmlFor="dateRange"
          className="block text-sm font-medium text-white"
        >
          Seleccione Fechas
        </label>
        <DatePicker
          selectsRange
          id="dateRange" // Ensure ID matches label's for attribute
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => setDateRange(update)}
          isClearable
          placeholderText="Seleccione fechas"
          className="col-span-3 p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          aria-labelledby="dateRange-label" // Add if needed for complex DatePickers
        />
      </div>
    </>
  );
};

export default InputGroup;
