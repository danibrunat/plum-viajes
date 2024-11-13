"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const getConfigString = (roomsCount, data) => {
  let configString = "";

  for (let i = 0; i < roomsCount; i++) {
    const adultsCount = parseInt(data.adults, 10);
    const childrenCount = parseInt(data.children, 10);
    const childrenAges = childrenCount > 0 ? data.childrenAges : [];

    const adultsPart = adultsCount;
    const childrenPart = childrenAges.length > 0 ? childrenAges.join("-") : "";

    const roomConfig = `${adultsPart}|${childrenPart}`;

    if (i > 0) {
      configString += ",";
    }
    configString += roomConfig;
  }

  return configString;
};

const Departures = ({ departures }) => {
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
    trigger,
  } = useForm();

  const onSubmit = (data) => {
    const { startDate } = data;

    const roomsCount = parseInt(data.rooms, 10);

    if (isNaN(roomsCount) || roomsCount <= 0) {
      console.error("Número de habitaciones no válido.");
      return;
    }

    const configString = getConfigString(roomsCount, data);

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("startDate", startDate);
    currentUrl.searchParams.set("endDate", startDate);
    currentUrl.searchParams.set("rooms", configString);
    window.location.href = currentUrl.toString();
  };

  const childrenCount = watch("children", 0);

  const handleChildrenCountChange = (event) => {
    const count = parseInt(event.target.value);
    if (count === 0) {
      clearErrors("childrenAges");
    }
    trigger("childrenAges");
  };

  useEffect(() => {
    if (childrenCount > 0) {
      trigger("childrenAges");
    }
  }, [childrenCount, trigger]);

  return (
    <div className="flex flex-col w-full">
      <em className="text-xs">
        Modifica la fecha de salida para ver otras tarifas disponibles:
      </em>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 bg-gray-300 rounded p-4 md:flex-row md:gap-5 md:items-center md:space-y-0 md:w-1/2"
      >
        <div>
          <label className="text-sm font-medium text-gray-700">
            Fecha de Salida
          </label>
          <select
            {...register("startDate", {
              required: "Este campo es obligatorio.",
            })}
            className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm md:mt-0"
          >
            {departures.map((departure) => (
              <option key={departure.date} value={departure.date}>
                {departure.date}
              </option>
            ))}
          </select>
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Adultos</label>
            <select
              {...register("adults", {
                required: "Debes seleccionar el número de adultos.",
              })}
              defaultValue={2}
              className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm md:mt-0"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            {errors.adults && (
              <p className="text-red-500 text-xs mt-1">
                {errors.adults.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Menores</label>
            <select
              {...register("children", {
                required: "Debes seleccionar el número de menores.",
                onChange: handleChildrenCountChange,
              })}
              className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm md:mt-0"
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            {errors.children && (
              <p className="text-red-500 text-xs mt-1">
                {errors.children.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">
              Habitación
            </label>
            <select
              {...register("rooms", {
                required: "Debes seleccionar la cantidad de habitaciones.",
              })}
              className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm md:mt-0"
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            {errors.rooms && (
              <p className="text-red-500 text-xs mt-1">
                {errors.rooms.message}
              </p>
            )}
          </div>
        </div>

        {childrenCount > 0 && (
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Edades de los menores
            </label>
            {Array.from({ length: childrenCount }, (_, index) => (
              <select
                key={index}
                {...register(`childrenAges[${index}]`, {
                  required: "Debes seleccionar una edad para cada menor.",
                  validate: (value) =>
                    value === "" ? "Selecciona una edad" : true,
                })}
                className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">-</option>
                {Array.from({ length: 16 }, (_, age) => age + 2).map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            ))}
            {errors.childrenAges && (
              <p className="text-red-500 text-xs mt-1">
                {errors.childrenAges.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="self-end bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
        >
          Buscar
        </button>
      </form>
    </div>
  );
};

export default Departures;
