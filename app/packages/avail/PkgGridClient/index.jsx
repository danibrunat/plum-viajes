"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PkgGrid = () => {
  const searchParams = useSearchParams();
  const [pkgGrid, setPkgGrid] = useState([]);

  useEffect(() => {
    async function fetchPackages(data) {
      const response = await data;
      return response;
    }
    const arrivalCity = searchParams.get("arrivalCity");
    const departureDate = searchParams.get("departureDate");
    const departureCity = searchParams.get("departureCity");

    fetchPackages({
      arrivalCity,
      departureDate,
      departureCity,
    }).then((pkgAvailabilityData) => setPkgGrid(pkgAvailabilityData));
  }, []);

  return <>{JSON.stringify(pkgGrid)}</>;
};

export default PkgGrid;
