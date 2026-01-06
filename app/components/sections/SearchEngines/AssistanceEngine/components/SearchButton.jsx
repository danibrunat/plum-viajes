"use client";

import { FaSearch } from "react-icons/fa";

export default function SearchButton() {
    return (
        <button
            type="submit"
            className="w-full md:w-auto px-8 h-[48px] bg-plumPrimaryOrange hover:bg-orange-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-4 md:mt-0"
        >
            <FaSearch className="text-white sm:mr-1" />
            <span>Cotizar Ahora</span>
        </button>
    );
}
