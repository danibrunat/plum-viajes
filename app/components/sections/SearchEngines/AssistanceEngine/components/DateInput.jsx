"use client";

import { Controller } from "react-hook-form";
import { FaCalendarAlt } from "react-icons/fa";

export default function DateInput({ control, name, label, min }) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor={name} className="flex items-center gap-2 text-sm font-medium text-white">
                <FaCalendarAlt className="text-white" />
                <span>{label}</span>
            </label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <input
                        {...field}
                        value={field.value ?? ""}
                        id={name}
                        type="date"
                        min={min}
                        className="w-full h-[42px] bg-white border border-gray-200 rounded-lg px-3 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                )}
            />
        </div>
    );
}
