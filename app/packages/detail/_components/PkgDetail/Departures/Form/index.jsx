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
    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:border-plumPrimaryOrange focus:bg-white focus:outline-none transition-all text-sm"
    aria-invalid={error ? "true" : "false"}
  >
    <option value="">Edad</option>
    {Array.from({ length: 16 }, (_, age) => age + 2).map((age) => (
      <option key={age} value={age}>
        {age} {age === 2 ? "año" : "años"}
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
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full mb-2">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-plumPrimaryPurple font-medium text-sm">
            Personalizar búsqueda
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          Modifica la fecha de salida para ver otras tarifas disponibles
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl p-4 border border-gray-100"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
          {/* Fecha de Salida */}
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="startDate"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              <span className="flex items-center gap-1">
                <svg
                  className="w-3 h-3 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Fecha de Salida
              </span>
            </label>
            <select
              id="startDate"
              {...register("startDate", {
                required: "Este campo es obligatorio.",
              })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:border-plumPrimaryOrange focus:bg-white focus:outline-none transition-all text-sm"
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
            </select>
            {errors.startDate && (
              <span role="alert" className="mt-1 text-xs text-red-600">
                {errors.startDate.message}
              </span>
            )}
          </div>

          {/* Adultos */}
          <div>
            <label
              htmlFor="adults"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              <span className="flex items-center gap-1">
                <svg
                  className="w-3 h-3 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Adultos
              </span>
            </label>
            <select
              id="adults"
              {...register("adults", {
                required: "Selecciona el número de adultos.",
              })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:border-plumPrimaryOrange focus:bg-white focus:outline-none transition-all text-sm"
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
          <div>
            <label
              htmlFor="children"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              <span className="flex items-center gap-1">
                <svg
                  className="w-3 h-3 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Menores
              </span>
            </label>
            <select
              id="children"
              {...register("children", {
                required: "Selecciona el número de menores.",
                onChange: handleChildrenCountChange,
              })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:border-plumPrimaryOrange focus:bg-white focus:outline-none transition-all text-sm"
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
          <div>
            <label
              htmlFor="occupancy"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              <span className="flex items-center gap-1">
                <svg
                  className="w-3 h-3 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Habitación
              </span>
            </label>
            <select
              id="occupancy"
              {...register("occupancy", {
                required: "Selecciona la cantidad de habitaciones.",
              })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:border-plumPrimaryOrange focus:bg-white focus:outline-none transition-all text-sm"
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

          {/* Botón de Envío */}
          <div>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200 text-sm"
              aria-label="Buscar disponibilidad"
            >
              <span className="flex items-center justify-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Buscar
              </span>
            </button>
          </div>
        </div>

        {/* Edades de los Menores - Aparece en nueva fila si hay menores */}
        {childrenCount > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <fieldset>
              <legend className="block text-xs font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Edades de los menores
                </span>
              </legend>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Array.from({ length: childrenCount }, (_, index) => (
                  <div key={index}>
                    <label className="text-xs text-gray-600 mb-1 block">
                      Menor {index + 1}
                    </label>
                    <ChildAgeSelect
                      index={index}
                      register={register}
                      error={errors.childrenAges?.[index]}
                    />
                  </div>
                ))}
              </div>
            </fieldset>
            {errors.childrenAges && (
              <span
                role="alert"
                className="mt-2 text-xs text-red-600 flex items-center gap-1"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {typeof errors.childrenAges.message === "string"
                  ? errors.childrenAges.message
                  : "Por favor selecciona una edad para cada menor"}
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default React.memo(DeparturesForm);
