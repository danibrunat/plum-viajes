"use client";

import { Controller } from "react-hook-form";
import { FaIdBadge } from "react-icons/fa";

export default function TripTypeInput({ control }) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="tripType" className="flex items-center gap-2 text-sm font-medium text-white">
                <FaIdBadge className="text-white" />
                <span>Tipo de viaje</span>
            </label>
            <Controller
                name="tripType"
                control={control}
                render={({ field }) => (
                    <select
                        {...field}
                        id="tripType"
                        className="w-full h-[42px] bg-white border border-gray-200 rounded-lg px-3 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="Un viaje">Un viaje</option>
                        <option value="Crucero">Crucero</option>
                        <option value="Estudios">Estudios</option>
                        <option value="Negocios">Negocios</option>
                    </select>
                )}
            />
        </div>
    );
}
