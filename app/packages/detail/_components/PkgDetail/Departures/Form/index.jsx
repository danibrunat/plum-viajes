"use client";
import React, { useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";

// Extraer la función de utilidad a una función pura
const getConfigString = (roomsCount, adults, children, childrenAges) => {
  let configString = "";
  for (let i = 0; i < roomsCount; i++) {
    const adultsCount = parseInt(adults, 10);
    const childrenCount = parseInt(children, 10);
    const agesArray = childrenCount > 0 ? childrenAges : [];

    const roomConfig = `${adultsCount}${
      agesArray.length > 0 ? `|${agesArray.join("-")}` : ""
    }`;
    if (i > 0) configString += ",";
    configString += roomConfig;
  }
  return configString;
};

// Componente para selección de edad de niño
const ChildAgeSelect = React.memo(({ index, register, error }) => (
  <select
    {...register(`childrenAges[${index}]`, {
      required: "Debes seleccionar una edad para cada menor.",
      validate: (value) => value !== "" || "Selecciona una edad",
    })}
    aria-label={`Edad del menor ${index + 1}`}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
    aria-invalid={error ? "true" : "false"}
  >
    <option value="">-</option>
    {Array.from({ length: 16 }, (_, age) => age + 2).map((age) => (
      <option key={age} value={age}>
        {age}
      </option>
    ))}
  </select>
));

ChildAgeSelect.displayName = "ChildAgeSelect";

// Componente principal
const DeparturesForm = ({ departures = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parsear parámetros de URL de forma más robusta
  const urlStartDate = searchParams.get("startDate");
  const defaultStartDate = useMemo(
    () => urlStartDate || (departures?.length ? departures[0].date : ""),
    [urlStartDate, departures]
  );

  // Extraer y parsear la ocupación
  const occupancyParam = searchParams.get("occupancy");
  const {
    defaultOccupancy,
    defaultAdults,
    defaultChildren,
    defaultChildrenAges,
  } = useMemo(() => {
    const defaults = {
      defaultOccupancy: "1",
      defaultAdults: "2",
      defaultChildren: "0",
      defaultChildrenAges: [],
    };

    if (!occupancyParam) return defaults;

    try {
      const rooms = occupancyParam.split(",");
      const roomsCount = rooms.length.toString();

      const firstRoom = rooms[0].split("|");
      const adults = firstRoom[0] || "2";

      let children = "0";
      let childrenAges = [];

      if (firstRoom.length > 1 && firstRoom[1].trim() !== "") {
        const ages = firstRoom[1].split("-");
        children = ages.length.toString();
        childrenAges = ages;
      }

      return {
        defaultOccupancy: roomsCount,
        defaultAdults: adults,
        defaultChildren: children,
        defaultChildrenAges: childrenAges,
      };
    } catch (error) {
      console.error("Error parsing occupancy parameter:", error);
      return defaults;
    }
  }, [occupancyParam]);

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

  const childrenCount = parseInt(watch("children", 0), 10);

  const handleChildrenCountChange = useCallback(
    (event) => {
      const count = parseInt(event.target.value, 10);
      if (count === 0) clearErrors("childrenAges");
      trigger("childrenAges");
    },
    [clearErrors, trigger]
  );

  useEffect(() => {
    if (childrenCount > 0) trigger("childrenAges");
  }, [childrenCount, trigger]);

  const onSubmit = useCallback(
    (data) => {
      const { startDate } = data;
      const roomsCount = parseInt(data.occupancy, 10);

      if (isNaN(roomsCount) || roomsCount <= 0) {
        console.error("Número de habitaciones no válido.");
        return;
      }

      // Construir URL utilizando URLSearchParams para mayor claridad
      const params = new URLSearchParams(window.location.search);

      if (!params.has("initialDate")) {
        const originalStartDate = params.get("startDate");
        params.set("initialDate", originalStartDate || defaultStartDate);
      }

      const configString = getConfigString(
        roomsCount,
        data.adults,
        data.children,
        data.childrenAges
      );

      params.set("startDate", startDate);
      params.set("endDate", startDate);
      params.set("occupancy", configString);

      // Usar el router para actualizar la URL sin recargar la página
      router.push(`${window.location.pathname}?${params.toString()}`);
    },
    [router, defaultStartDate]
  );

  // Opciones para los selects - memoizadas para prevenir re-renders
  const adultOptions = useMemo(() => [1, 2, 3, 4], []);
  const childrenOptions = useMemo(() => [0, 1, 2, 3], []);
  const roomOptions = useMemo(() => [1, 2], []);

  return (
    <div className="w-full px-4 md:max-w-6xl md:mx-auto">
      <em className="block text-center text-base md:text-lg font-medium text-gray-700 mb-4">
        Modifica la fecha de salida para ver otras tarifas disponibles:
      </em>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:items-end gap-4 md:space-x-4"
      >
        {/* Fecha de Salida */}
        <div className="flex flex-col w-full md:w-auto">
          <label
            htmlFor="startDate"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Fecha de Salida
          </label>
          <select
            id="startDate"
            {...register("startDate", {
              required: "Este campo es obligatorio.",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            aria-invalid={errors.startDate ? "true" : "false"}
          >
            {!departures || departures.length === 0 ? (
              <option value="">No hay fechas disponibles</option>
            ) : (
              departures.map((departure) => (
                <option key={departure.date} value={departure.date}>
                  {departure.date}
                </option>
              ))
            )}
            {/* Mapear las fechas de salida disponibles */}
          </select>
          {errors.startDate && (
            <span role="alert" className="mt-1 text-xs text-red-600">
              {errors.startDate.message}
            </span>
          )}
        </div>

        {/* Grid for Adultos, Menores, Habitación */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
          {/* Adultos */}
          <div className="flex flex-col">
            <label
              htmlFor="adults"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Adultos
            </label>
            <select
              id="adults"
              {...register("adults", {
                required: "Selecciona el número de adultos.",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              aria-invalid={errors.adults ? "true" : "false"}
            >
              {adultOptions.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {errors.adults && (
              <span role="alert" className="mt-1 text-xs text-red-600">
                {errors.adults.message}
              </span>
            )}
          </div>

          {/* Menores */}
          <div className="flex flex-col">
            <label
              htmlFor="children"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Menores
            </label>
            <select
              id="children"
              {...register("children", {
                required: "Selecciona el número de menores.",
                onChange: handleChildrenCountChange,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              aria-invalid={errors.children ? "true" : "false"}
            >
              {childrenOptions.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {errors.children && (
              <span role="alert" className="mt-1 text-xs text-red-600">
                {errors.children.message}
              </span>
            )}
          </div>

          {/* Habitaciones */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label
              htmlFor="occupancy"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Habitación
            </label>
            <select
              id="occupancy"
              {...register("occupancy", {
                required: "Selecciona la cantidad de habitaciones.",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              aria-invalid={errors.occupancy ? "true" : "false"}
            >
              {roomOptions.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {errors.occupancy && (
              <span role="alert" className="mt-1 text-xs text-red-600">
                {errors.occupancy.message}
              </span>
            )}
          </div>
        </div>

        {/* Edades de los Menores */}
        {childrenCount > 0 && (
          <div className="flex flex-col w-full md:w-auto">
            <fieldset>
              <legend className="text-sm font-medium text-gray-700 mb-1">
                Edades de los menores
              </legend>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {Array.from({ length: childrenCount }, (_, index) => (
                  <ChildAgeSelect
                    key={index}
                    index={index}
                    register={register}
                    error={errors.childrenAges?.[index]}
                  />
                ))}
              </div>
            </fieldset>
            {errors.childrenAges && (
              <span role="alert" className="mt-1 text-xs text-red-600">
                {typeof errors.childrenAges.message === "string"
                  ? errors.childrenAges.message
                  : "Por favor selecciona una edad para cada menor"}
              </span>
            )}
          </div>
        )}

        {/* Botón de Envío */}
        <div className="w-full md:w-auto">
          <button
            type="submit"
            className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md shadow transition-colors"
            aria-label="Buscar disponibilidad"
          >
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(DeparturesForm);
