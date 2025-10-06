import { ApiUtils } from "./apiUtils.service.js";

/**
 * Fetches package detail based on provider and id
 * @async
 * @param {Object} params - Parameters for fetching package details
 * @returns {Promise<Object>} The package detail data
 */
export const getPkgDetail = async ({
  provider,
  id,
  arrivalCity,
  departureCity,
  startDate,
  endDate,
  priceId,
  occupancy,
  departureId,
}) => {
  try {
    const pkgDetailRequest = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/packages/detail`,
      {
        method: "POST",
        body: JSON.stringify({
          provider,
          id,
          arrivalCity,
          departureCity,
          startDate,
          endDate,
          priceId,
          occupancy,
          departureId,
        }),
        headers: ApiUtils.getCommonHeaders(),
      }
    );

    if (!pkgDetailRequest.ok) {
      const response = await pkgDetailRequest.json();
      return {
        error: `Ocurrió un error en el detail de paquetes. Razón: ${JSON.stringify(response)}`,
      };
    }

    return pkgDetailRequest.json();
  } catch (error) {
    return {
      error: `Ocurrió un error en el detail de paquetes. Razón: ${error.message}`,
    };
  }
};
