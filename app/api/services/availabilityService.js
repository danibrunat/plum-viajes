import { ApiUtils } from "./apiUtils.service";

/**
 * Fetches package availability based on search parameters
 * @async
 * @param {Object} searchParams - The search parameters
 * @param {Object} selectedFilters - Filters to apply
 * @returns {Promise<Object>} The package availability data
 * @throws {Error} If the fetch request fails
 */
export const getPkgAvailabilityAndFilters = async (
  searchParams,
  selectedFilters
) => {
  try {
    const pkgAvailabilityRequest = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/packages/availability`,
      {
        method: "POST",
        body: JSON.stringify({ searchParams, selectedFilters }),
        headers: ApiUtils.getCommonHeaders(),
      }
    );

    if (!pkgAvailabilityRequest.ok) {
      const response = await pkgAvailabilityRequest.json();
      throw new Error(
        `Ocurrió un error en el avail de paquetes. Razón: ${response.reason || "Desconocida"}`
      );
    }

    return pkgAvailabilityRequest.json();
  } catch (error) {
    throw new Error(`Error en disponibilidad: ${error.message}`);
  }
};
