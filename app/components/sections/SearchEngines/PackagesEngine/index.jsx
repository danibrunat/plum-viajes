"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import {
  FaCalendar,
  FaGlobeAmericas,
  FaMapMarked,
  FaSearch,
} from "react-icons/fa";
import PackageEngineItem from "./PackageEngineItem";
import { ProviderService } from "../../../../api/services/providers";
import CitiesService from "../../../../services/cities.service";

// Placeholder que mantiene las mismas dimensiones que react-select
const SelectPlaceholder = ({ className = "" }) => (
  <div
    className={`h-[38px] bg-white border border-gray-300 rounded flex items-center px-3 text-gray-400 ${className}`}
  >
    Seleccione
  </div>
);

const getPackageEngineItems = (isMounted) => {
  function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId); // Reiniciar el temporizador
      timeoutId = setTimeout(() => {
        fn(...args); // Ejecutar la función después del tiempo de espera
      }, delay);
    };
  }

  const getCitiesAutocompleteApi = async (query, inputName) =>
    await CitiesService.getCitiesAutocompleteApi(query, inputName);

  const loadOptions = debounce(async (query, callback, inputName) => {
    if (query.length >= 3) {
      const citiesFetch = await getCitiesAutocompleteApi(query, inputName);
      callback(citiesFetch);
    }
  }, 500); // Espera de 500ms después de que el usuario deje de escribir

  const packageEngineItems = [
    {
      id: "arrivalCity",
      title: "¿Dónde querés ir?",
      name: "arrivalCity",
      icon: <FaGlobeAmericas className="text-gray-200" />,
      children: (field) => (
        <div className="w-full md:w-72">
          {isMounted ? (
            <AsyncSelect
              {...field}
              id="arrivalCity"
              cacheOptions={true}
              instanceId="arrivalCity"
              loadingMessage={() => "Buscando ciudades..."}
              noOptionsMessage={() => "No se encontraron ciudades"}
              placeholder="Seleccione"
              loadOptions={(query, callback) =>
                loadOptions(query, callback, "arrivalCity")
              }
            />
          ) : (
            <SelectPlaceholder />
          )}
        </div>
      ),
    },
    {
      id: "departureMonthYear",
      name: "departureMonthYear",
      title: "¿Cuándo pensás viajar?",
      icon: <FaCalendar className="text-gray-200" />,
      children: (field) => (
        <div className="w-full p-1">
          {isMounted ? (
            <Select
              {...field}
              id="departureDateMonthYear"
              instanceId="departureDateMonthYear"
              placeholder="Seleccione"
              options={ProviderService.departureDateMonthYear()}
            />
          ) : (
            <SelectPlaceholder />
          )}
        </div>
      ),
    },
    {
      id: "departureCity",
      name: "departureCity",
      title: "¿Desde qué ciudad partís?",
      icon: <FaMapMarked className="text-gray-200" />,
      children: (field) => (
        <div className="w-full p-1">
          {isMounted ? (
            <AsyncSelect
              {...field}
              id="departureCity"
              instanceId="departureCity"
              cacheOptions={true}
              loadingMessage={() => "Buscando ciudades..."}
              noOptionsMessage={() => "No se encontraron ciudades"}
              placeholder="Seleccione"
              loadOptions={(query, callback) =>
                loadOptions(query, callback, "departureCity")
              }
            />
          ) : (
            <SelectPlaceholder />
          )}
        </div>
      ),
    },
  ];

  return packageEngineItems;
};

const generateAvailUrl = (product, searchData) => {
  const arrivalCity = searchData["arrivalCity"].value;
  const departureCity = searchData["departureCity"].value;
  const departureFromTo = ProviderService.departureDateFromTo(
    searchData["departureMonthYear"].value
  );
  // occupancy=2 -> 2 adults.
  //TODO: abstraer en un método que se pueda llamar desde otros lados que necesiten armar la url del avail.
  const availUrl = `/${product}/avail?arrivalCity=${arrivalCity}&departureCity=${departureCity}&startDate=${departureFromTo.startDate}&endDate=${departureFromTo.endDate}&occupancy=2`;

  return availUrl;
};

const FormSubmitButton = () => {
  return (
    <div className="flex w-full items-center justify-center md:w-1/4 ">
      <div className="flex p-3 w-auto transition ease-in-out delay-50 rounded hover:-translate-y-1 hover:scale-110 hover:bg-plumPrimaryOrange duration-300">
        <button
          className="flex gap-2 items-center text-white"
          aria-label="Buscar paquetes"
          type="submit"
        >
          <FaSearch className="text-gray-200" /> Buscar Paquetes
        </button>
      </div>
    </div>
  );
};

export default function PackagesEngine({ defaultValues = {} }) {
  const [isMounted, setIsMounted] = useState(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm(defaultValues);

  useEffect(() => {
    setIsMounted(true);
    reset({
      arrivalCity: defaultValues.arrivalCity,
      departureCity: defaultValues.departureCity,
      departureMonthYear: defaultValues.departureMonthYear,
    });
  }, []);

  function handlePkgSearch(data) {
    const packagesAvailUrl = generateAvailUrl("packages", data);
    window.location = packagesAvailUrl;
  }

  const renderFormItems = () => {
    const packageEngineItems = getPackageEngineItems(isMounted);
    return packageEngineItems.map((item) => {
      return (
        <PackageEngineItem key={item.id} title={item.title} icon={item.icon}>
          <Controller
            name={item.name}
            control={control}
            render={({ field }) => item.children(field)}
          />
        </PackageEngineItem>
      );
    });
  };

  const formItems = renderFormItems();

  return (
    <form
      className="flex flex-col md:flex-row justify-center items-center gap-3 px-2"
      onSubmit={handleSubmit(handlePkgSearch)}
      id="pkgSearchForm"
    >
      {formItems}
      <FormSubmitButton />
    </form>
  );
}
