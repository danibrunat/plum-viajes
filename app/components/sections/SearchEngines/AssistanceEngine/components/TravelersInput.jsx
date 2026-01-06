"use client";

import { Controller } from "react-hook-form";
import { FaUsers } from "react-icons/fa";

export default function TravelersInput({ control }) {
    return (
        <div className="flex gap-4 w-full">
            <div className="flex flex-col gap-1.5 w-full/2">
                <label htmlFor="travelers" className="flex items-center gap-2 text-sm font-medium text-white">
                    <FaUsers className="text-white" />
                    <span>Viajeros</span>
                </label>
                <Controller
                    name="travelers"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            id="travelers"
                            type="number"
                            min={1}
                            className="w-full h-[42px] bg-white border border-gray-200 rounded-lg px-3 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                    )}
                />
            </div>
            <div className="flex flex-col gap-1.5 w-full/2">
                <label htmlFor="age1" className="flex items-center gap-2 text-sm font-medium text-white">
                    <FaUsers className="text-white" />
                    <span>Edad</span>
                </label>
                <Controller
                    name="age1"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            id="age1"
                            type="number"
                            min={0}
                            placeholder="Edad"
                            className="w-full h-[42px] bg-white border border-gray-200 rounded-lg px-3 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                    )}
                />
            </div>
        </div>
    );
}
