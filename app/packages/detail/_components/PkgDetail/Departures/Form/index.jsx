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

const DeparturesForm = ({ departures }) => {
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

    // TODO: Resolver el initialDate para poder guardarlo. Ya que hoy startDate es el que vos elegís en departures. Si elijo otro, se actualiza el start date y por ende las departures del select se toman desde el nuevo startDate, se pierden las anteriores...
    /*  if (!currentUrl.searchParams.get("initialDate"))
      currentUrl.searchParams.set("initialDate", startDate); */

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
    <div className="flex flex-col w-full items-center">
      <em className="text-sm text-gray-600 mb-4">
        Modifica la fecha de salida para ver otras tarifas disponibles:
      </em>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full bg-white p-6 rounded-lg shadow-lg space-y-6 md:flex-row md:items-center md:space-y-0 md:space-x-6"
      >
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Salida
          </label>
          <select
            {...register("startDate", {
              required: "Este campo es obligatorio.",
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-700"
          >
            {departures.map((departure) => (
              <option key={departure.date} value={departure.date}>
                {departure.date}
              </option>
            ))}
          </select>
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-2">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div className="flex flex-1 space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adultos
            </label>
            <select
              {...register("adults", {
                required: "Debes seleccionar el número de adultos.",
              })}
              defaultValue={"2"}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-700"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            {errors.adults && (
              <p className="text-red-500 text-xs mt-2">
                {errors.adults.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menores
            </label>
            <select
              {...register("children", {
                required: "Debes seleccionar el número de menores.",
                onChange: handleChildrenCountChange,
              })}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-700"
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            {errors.children && (
              <p className="text-red-500 text-xs mt-2">
                {errors.children.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habitación
            </label>
            <select
              {...register("rooms", {
                required: "Debes seleccionar la cantidad de habitaciones.",
              })}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-700"
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            {errors.rooms && (
              <p className="text-red-500 text-xs mt-2">
                {errors.rooms.message}
              </p>
            )}
          </div>
        </div>

        {childrenCount > 0 && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="mb-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-700"
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
              <p className="text-red-500 text-xs mt-2">
                {errors.childrenAges.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="self-end bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors shadow-lg"
        >
          Buscar
        </button>
      </form>
    </div>
  );
};

export default DeparturesForm;
