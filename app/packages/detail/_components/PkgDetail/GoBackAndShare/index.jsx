"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaSearch } from "react-icons/fa";
import Link from "next/link";
export default function GoBackAndShare() {
  const router = useRouter();
  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-2">
        <button onClick={() => router.back()}>
          <span className="flex items-center gap-1 text-blue-800">
            <FaChevronLeft /> Volver |
          </span>
        </button>

        <Link href="/">
          <span className="flex items-center gap-1 text-blue-800">
            <FaSearch /> Nueva búsqueda
          </span>
        </Link>
      </div>
    </div>
  );
}
