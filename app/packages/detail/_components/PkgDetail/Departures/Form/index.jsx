"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";

const getConfigString = (roomsCount, data) => {
  let configString = "";
  for (let i = 0; i < roomsCount; i++) {
    const adultsCount = parseInt(data.adults, 10);
    const childrenCount = parseInt(data.children, 10);
    const childrenAges = childrenCount > 0 ? data.childrenAges : [];
    const roomConfig = `${adultsCount}${
      childrenAges.length > 0 ? `|${childrenAges.join("-")}` : ""
    }`;
    if (i > 0) configString += ",";
    configString += roomConfig;
  }
  return configString;
};

const DeparturesForm = ({ departures }) => {
  const searchParams = useSearchParams();
  // Si existe "startDate" en la URL, se usa; sino se usa el primer departure recibido
  const urlStartDate = searchParams.get("startDate");
  const defaultStartDate =
    urlStartDate || (departures?.length ? departures[0].date : "");

  // Parseamos el parámetro occupancy (ejemplo: "2|11,2|11")
  const occupancyParam = searchParams.get("occupancy");
  let defaultOccupancy = "1"; // número de habitaciones
  let defaultAdults = ""; // cantidad de adultos (del primer room)
  let defaultChildren = "0"; // cantidad de menores
  let defaultChildrenAges = []; // edades de los menores

  if (occupancyParam) {
    const rooms = occupancyParam.split(",");
    defaultOccupancy = rooms.length.toString();
    const firstRoom = rooms[0].split("|");
    defaultAdults = firstRoom[0];
    if (firstRoom.length > 1 && firstRoom[1].trim() !== "") {
      const ages = firstRoom[1].split("-");
      defaultChildren = ages.length.toString();
      defaultChildrenAges = ages;
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      startDate: defaultStartDate,
      occupancy: defaultOccupancy,
      adults: defaultAdults,
      children: defaultChildren,
      childrenAges: defaultChildrenAges,
    },
  });

  const onSubmit = (data) => {
    const { startDate } = data;
    const roomsCount = parseInt(data.occupancy, 10);

    if (isNaN(roomsCount) || roomsCount <= 0) {
      console.error("Número de habitaciones no válido.");
      return;
    }

    const configString = getConfigString(roomsCount, data);
    const currentUrl = new URL(window.location.href);

    if (!currentUrl.searchParams.has("initialDate")) {
      const originalStartDate = currentUrl.searchParams.get("startDate");
      currentUrl.searchParams.set("initialDate", originalStartDate);
    }

    currentUrl.searchParams.set("startDate", startDate);
    currentUrl.searchParams.set("endDate", startDate);
    currentUrl.searchParams.set("occupancy", configString);
    window.location.href = currentUrl.toString();
  };

  const childrenCount = watch("children", 0);

  const handleChildrenCountChange = (event) => {
    const count = parseInt(event.target.value);
    if (count === 0) clearErrors("childrenAges");
    trigger("childrenAges");
  };

  useEffect(() => {
    if (childrenCount > 0) trigger("childrenAges");
  }, [childrenCount, trigger]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <em className="block text-center text-lg font-medium text-gray-700 mb-4">
        Modifica la fecha de salida para ver otras tarifas disponibles:
      </em>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow rounded-lg p-4 flex items-center space-x-4 overflow-x-auto"
      >
        {/* Fecha de Salida */}
        <div className="flex flex-col min-w-[150px]">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Fecha de Salida
          </label>
          <select
            {...register("startDate", {
              required: "Este campo es obligatorio.",
            })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          >
            {departures.map((departure) => (
              <option key={departure.date} value={departure.date}>
                {departure.date}
              </option>
            ))}
          </select>
          {errors.startDate && (
            <span className="mt-1 text-xs text-red-600">
              {errors.startDate.message}
            </span>
          )}
        </div>

        {/* Adultos */}
        <div className="flex flex-col min-w-[120px]">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Adultos
          </label>
          <select
            {...register("adults", {
              required: "Selecciona el número de adultos.",
            })}
            defaultValue="2"
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {errors.adults && (
            <span className="mt-1 text-xs text-red-600">
              {errors.adults.message}
            </span>
          )}
        </div>

        {/* Menores */}
        <div className="flex flex-col min-w-[120px]">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Menores
          </label>
          <select
            {...register("children", {
              required: "Selecciona el número de menores.",
              onChange: handleChildrenCountChange,
            })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          >
            {[0, 1, 2, 3].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {errors.children && (
            <span className="mt-1 text-xs text-red-600">
              {errors.children.message}
            </span>
          )}
        </div>

        {/* Habitaciones */}
        <div className="flex flex-col min-w-[120px]">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Habitación
          </label>
          <select
            {...register("occupancy", {
              required: "Selecciona la cantidad de habitaciones.",
            })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          >
            {[1, 2].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {errors.occupancy && (
            <span className="mt-1 text-xs text-red-600">
              {errors.occupancy.message}
            </span>
          )}
        </div>

        {/* Edades de los Menores */}
        {childrenCount > 0 && (
          <div className="flex flex-col min-w-[150px]">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Edades de los menores
            </label>
            <div className="space-y-2">
              {Array.from({ length: childrenCount }, (_, index) => (
                <select
                  key={index}
                  {...register(`childrenAges[${index}]`, {
                    required: "Debes seleccionar una edad para cada menor.",
                    validate: (value) =>
                      value === "" ? "Selecciona una edad" : true,
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">-</option>
                  {Array.from({ length: 16 }, (_, age) => age + 2).map(
                    (age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    )
                  )}
                </select>
              ))}
            </div>
            {errors.childrenAges && (
              <span className="mt-1 text-xs text-red-600">
                {errors.childrenAges.message}
              </span>
            )}
          </div>
        )}

        {/* Botón de Envío */}
        <div className="flex-shrink-0">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md shadow transition-colors whitespace-nowrap"
          >
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeparturesForm;
