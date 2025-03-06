import { useState, useEffect, useCallback } from "react";
import { client } from "../../lib/client";
import { CitiesService } from "../../../app/services/cities.service";

const buildQuery = (filters) => {
  let baseQuery = `*[_type == "packages"`;
  let conditions = [];

  if (filters.title) {
    conditions.push(`title match "${filters.title}*"`);
  }

  if (filters.destination) {
    conditions.push(`"${filters.destination}" in destination[]->iata_code`);
  }

  if (filters.operator) {
    conditions.push(`operator == "${filters.operator}"`);
  }

  if (filters.origin) {
    conditions.push(`"${filters.origin}" in origin`);
  }

  if (conditions.length > 0) {
    baseQuery += ` && ${conditions.join(" && ")}`;
  }
  baseQuery += `]`;
  baseQuery += `{
  ...,
  destination[]-> {
        iata_code
      },
}
  `;
  console.log("baseQuery", baseQuery);
  return baseQuery;
};

const getCitiesData = async (cityIds) => {
  if (!Array.isArray(cityIds) || cityIds.length === 0) return [];
  const asObject = true;

  try {
    const citiesData = await Promise.all(
      cityIds.map((cityId) => CitiesService.getCityByCode(cityId, asObject))
    );
    return citiesData;
  } catch (error) {
    console.error("Error fetching city data:", error);
    return [];
  }
};

const usePlumPackages = (initialFilters, initialLimit) => {
  const [filters, setFilters] = useState(initialFilters);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = initialLimit;

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    const offset = (page - 1) * limit;
    let query = buildQuery(filters);
    query = query.replace(/\]$/, `][${offset}...${offset + limit}]`);

    const results = await client.fetch(query);
    console.log("results", results);
    // Actualizar ciudades en lote
    const uniqueDestIds = new Set();
    const uniqueOriginIds = new Set();

    results.forEach((pkg) => {
      if (Array.isArray(pkg.destination)) {
        pkg.destination.forEach((destId) =>
          uniqueDestIds.add(destId.iata_code)
        );
      }
      if (Array.isArray(pkg.origin)) {
        pkg.origin.forEach((originId) => uniqueOriginIds.add(originId));
      }
    });

    const [destinationsData, originsData] = await Promise.all([
      getCitiesData([...uniqueDestIds]),
      getCitiesData([...uniqueOriginIds]),
    ]);

    const destMap = {};
    destinationsData.forEach((city) => {
      destMap[city.code] = city;
    });
    const originMap = {};
    originsData.forEach((city) => {
      originMap[city.code] = city;
    });

    const updatedResults = results.map((pkg) => ({
      ...pkg,
      destination: Array.isArray(pkg.destination)
        ? pkg.destination.map((destId) => destMap[destId]).filter(Boolean)
        : [],
      origin: Array.isArray(pkg.origin)
        ? pkg.origin.map((originId) => originMap[originId]).filter(Boolean)
        : [],
    }));

    setPackages(updatedResults);
    setLoading(false);
  }, [filters, page, limit]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return {
    packages,
    setFilters,
    loading,
    page,
    setPage,
    refresh: fetchPackages,
  };
};

export default usePlumPackages;
