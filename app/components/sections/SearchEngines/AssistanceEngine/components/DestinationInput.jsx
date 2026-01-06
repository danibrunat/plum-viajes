"use client";

import { useMemo } from "react";
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { FaGlobeAmericas } from "react-icons/fa";
import CitiesService from "../../../../../services/cities.service";

const SelectPlaceholder = ({ className = "" }) => (
    <div
        className={`h-[42px] bg-gray-50 border border-gray-200 rounded-lg flex items-center px-3 text-gray-400 text-sm ${className}`}
    >
        Seleccione destino
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

export default function DestinationInput({ control, isMounted }) {
    const loadOptions = useCityLoader();

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="destination" className="flex items-center gap-2 text-sm font-medium text-white">
                <FaGlobeAmericas className="text-white" />
                <span>¿A dónde viajas?</span>
            </label>
            <div className="w-full">
                {isMounted ? (
                    <Controller
                        name="destination"
                        control={control}
                        render={({ field }) => (
                            <AsyncSelect
                                {...field}
                                id="destination"
                                instanceId="destination"
                                cacheOptions
                                loadingMessage={() => "Buscando..."}
                                noOptionsMessage={() => "Sin resultados"}
                                placeholder="Seleccione destino"
                                loadOptions={(query, callback) =>
                                    loadOptions(query, callback, "destination")
                                }
                                classNames={{
                                    control: (state) =>
                                        `!min-h-[42px] !bg-white !border-gray-200 !rounded-lg !shadow-sm hover:!border-purple-500 focus:!border-purple-500 !text-sm`,
                                    input: () => "!text-gray-800",
                                    placeholder: () => "!text-gray-400",
                                    singleValue: () => "!text-gray-800",
                                    menu: () => "!bg-white !rounded-lg !shadow-lg !mt-1 !border !border-gray-100",
                                    option: (state) =>
                                        state.isSelected
                                            ? "!bg-purple-600 !text-white"
                                            : state.isFocused
                                                ? "!bg-purple-50 !text-gray-800"
                                                : "!text-gray-600",
                                }}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        border: '1px solid #e5e7eb',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            border: '1px solid #A855F7' // purple-500
                                        }
                                    })
                                }}
                            />
                        )}
                    />
                ) : (
                    <SelectPlaceholder />
                )}
            </div>
        </div>
    );
}
