import { useState, useEffect, useCallback } from "react";
import { client } from "../../lib/client";

const buildQuery = (filters) => {
  let baseQuery = `*[_type == "packages"`;
  let conditions = [];

  if (filters.title) {
    conditions.push(`title match "${filters.title}*"`);
  }

  if (filters.destination) {
    conditions.push(
      `"${filters.destination}" in destination[]->iata_code || "${filters.destination}" in destination[]->name`
    );
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
        iata_code,
        name
      },
  origin
}
  `;
  return baseQuery;
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
    setPackages(results);
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
