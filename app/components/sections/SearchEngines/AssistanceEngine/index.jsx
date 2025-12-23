"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { FaCalendarAlt, FaGlobeAmericas, FaSearch, FaUsers, FaIdBadge } from "react-icons/fa";
import CitiesService from "../../../../services/cities.service";

const SelectPlaceholder = ({ className = "" }) => (
  <div
    className={`h-[38px] bg-white border border-gray-300 rounded flex items-center px-3 text-gray-400 ${className}`}
  >
    Seleccione
  </div>
);

function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const buildAvailUrl = (searchData) => {
  const destination = searchData.destination?.value;
  const startDate = searchData.startDate;
  const endDate = searchData.endDate;
  const travelers = searchData.travelers || 1;
  const age1 = searchData.age1 || "";
  const originCountry = searchData.originCountry || "ARGENTINA";
  const tripType = searchData.tripType || "Un viaje";

  const params = new URLSearchParams({
    destination,
    startDate,
    endDate,
    travelers,
    age1,
    originCountry,
    tripType,
  });

  return `/assistance/avail?${params.toString()}`;
};

const loadCities = async (query, inputName) => {
  return CitiesService.getCitiesAutocompleteApi(query, inputName);
};

const useCityLoader = () => {
  const debounced = useMemo(
    () =>
      debounce(async (query, callback, inputName) => {
        if (query.length < 3) return;
        const citiesFetch = await loadCities(query, inputName);
        callback(citiesFetch);
      }, 400),
    []
  );

  return debounced;
};

const renderFieldConfig = (isMounted, loadOptions) => [
  {
    id: "destination",
    name: "destination",
    label: "A donde viajas?",
    icon: <FaGlobeAmericas className="text-gray-200" />,
    render: (field) => (
      <div className="w-full md:w-72">
        {isMounted ? (
          <AsyncSelect
            {...field}
            id="destination"
            instanceId="destination"
            cacheOptions
            loadingMessage={() => "Buscando destinos..."}
            noOptionsMessage={() => "No se encontraron destinos"}
            placeholder="Seleccione"
            loadOptions={(query, callback) =>
              loadOptions(query, callback, "destination")
            }
          />
        ) : (
          <SelectPlaceholder />
        )}
      </div>
    ),
  },
  {
    id: "originCountry",
    name: "originCountry",
    label: "Pais origen",
    icon: <FaGlobeAmericas className="text-gray-200" />,
    render: (field) => (
      <input
        {...field}
        id="originCountry"
        type="text"
        className="w-full md:w-40 h-[38px] rounded border border-gray-300 px-3"
        placeholder="ARGENTINA"
      />
    ),
  },
  {
    id: "tripType",
    name: "tripType",
    label: "Tipo de viaje",
    icon: <FaIdBadge className="text-gray-200" />,
    render: (field) => (
      <select
        {...field}
        id="tripType"
        className="w-full md:w-44 h-[38px] rounded border border-gray-300 px-3"
      >
        <option value="Un viaje">Un viaje</option>
        <option value="Crucero">Crucero</option>
        <option value="Estudios">Estudios</option>
        <option value="Negocios">Negocios</option>
      </select>
    ),
  },
  {
    id: "startDate",
    name: "startDate",
    label: "Fecha de inicio",
    icon: <FaCalendarAlt className="text-gray-200" />,
    render: (field) => (
      <input
        {...field}
        id="startDate"
        type="date"
        className="w-full md:w-40 h-[38px] rounded border border-gray-300 px-3"
      />
    ),
  },
  {
    id: "endDate",
    name: "endDate",
    label: "Fecha de fin",
    icon: <FaCalendarAlt className="text-gray-200" />,
    render: (field) => (
      <input
        {...field}
        id="endDate"
        type="date"
        className="w-full md:w-40 h-[38px] rounded border border-gray-300 px-3"
      />
    ),
  },
  {
    id: "travelers",
    name: "travelers",
    label: "Viajeros",
    icon: <FaUsers className="text-gray-200" />,
    render: (field) => (
      <input
        {...field}
        id="travelers"
        type="number"
        min={1}
        className="w-full md:w-28 h-[38px] rounded border border-gray-300 px-3"
      />
    ),
  },
  {
    id: "age1",
    name: "age1",
    label: "Edad pasajero 1",
    icon: <FaUsers className="text-gray-200" />,
    render: (field) => (
      <input
        {...field}
        id="age1"
        type="number"
        min={0}
        className="w-full md:w-28 h-[38px] rounded border border-gray-300 px-3"
      />
    ),
  },
];

const FormSubmitButton = () => (
  <div className="flex w-full items-center justify-center md:w-1/4 ">
    <div className="flex p-3 w-auto transition ease-in-out delay-50 rounded hover:-translate-y-1 hover:scale-110 hover:bg-plumPrimaryOrange duration-300">
      <button
        className="flex gap-2 items-center text-white"
        aria-label="Buscar asistencia"
        type="submit"
      >
        <FaSearch className="text-gray-200" /> Buscar asistencia
      </button>
    </div>
  </div>
);

export default function AssistanceEngine({ defaultValues = {} }) {
  const [isMounted, setIsMounted] = useState(false);
  const loadOptions = useCityLoader();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      destination: defaultValues.destination,
      startDate: defaultValues.startDate,
      endDate: defaultValues.endDate,
      travelers: defaultValues.travelers || 1,
      age1: defaultValues.age1 || "",
      originCountry: defaultValues.originCountry || "ARGENTINA",
      tripType: defaultValues.tripType || "Un viaje",
    },
  });

  useEffect(() => {
    setIsMounted(true);
    const destinationValue =
      typeof defaultValues.destination === "string"
        ? { value: defaultValues.destination, label: defaultValues.destination }
        : defaultValues.destination;

    reset({
      destination: destinationValue,
      startDate: defaultValues.startDate,
      endDate: defaultValues.endDate,
      travelers: defaultValues.travelers || 1,
      age1: defaultValues.age1 || "",
      originCountry: defaultValues.originCountry || "ARGENTINA",
      tripType: defaultValues.tripType || "Un viaje",
    });
  }, [defaultValues, reset]);

  const onSubmit = (formData) => {
    const availUrl = buildAvailUrl(formData);
    window.location = availUrl;
  };

  const fields = renderFieldConfig(isMounted, loadOptions);

  return (
    <div className="w-full max-w-5xl mx-auto px-2">
      <div className="bg-white/10 border border-white/15 backdrop-blur rounded-2xl shadow-lg p-4 md:p-6">
        <div className="flex flex-col gap-1 mb-4 text-white">
          <p className="text-xs uppercase tracking-wide text-white/80">Asistencia al viajero</p>
          <h3 className="text-xl font-semibold">Cotiza tu asistencia</h3>
          <p className="text-sm text-white/80">Completa destino, fechas y los datos minimos que exige UA.</p>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          id="assistanceSearchForm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 bg-white/90 rounded-lg p-3 shadow-sm"
              >
                <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <Controller
                  name={item.name}
                  control={control}
                  render={({ field }) => item.render(field)}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
