"use client";
import React from "react";
import { useForm } from "react-hook-form";

const Departures = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    // Handle form submission
    console.log("Form Data:", data);
  };

  return (
    <div className="flex flex-col w-full">
      <em className="text-xs">
        Modifica la fecha de salida para ver otras tarifas disponibles:
      </em>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4  bg-gray-300 rounded p-4 md:flex-row md:gap-5 md:items-center md:space-y-0 md:w-1/2"
      >
        {/* Fecha de Salida */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Fecha de Salida
          </label>
          <select
            {...register("departureDate")}
            className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm md:mt-0"
          >
            <option value="8 Feb 2025">8 Feb 2025</option>
            <option value="9 Feb 2025">9 Feb 2025</option>
            <option value="10 Feb 2025">10 Feb 2025</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <div className="flex-1">
            <label className=" text-sm font-medium text-gray-700">
              Adultos
            </label>
            <select
              {...register("adults")}
              defaultValue={2}
              className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm md:mt-0"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <div className="flex-1">
            <label className=" text-sm font-medium text-gray-700">
              Menores
            </label>
            <select
              {...register("children")}
              className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm md:mt-0"
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">
              Habitación
            </label>
            <select
              {...register("rooms")}
              className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm md:mt-0"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>

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
