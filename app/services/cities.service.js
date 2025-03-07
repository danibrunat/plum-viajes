import { ApiUtils } from "../api/services/apiUtils.service";
import CACHE from "../constants/cachePolicies";

const isFrontEndCall = typeof process.env.SANITY_STUDIO_URL == "undefined";

/**
 * Service for handling city-related operations.
 */
export const CitiesService = {
  /**
   * Fetches city information by its code.
   *
   * @param {string} code - The code of the city to fetch.
   * @param {boolean} [asObject=false] - Whether to return the result as a single object.
   * @returns {Promise<Object|Array>} A promise that resolves to the city data, either as an object or an array.
   * @throws {Object} An error object if the fetch operation fails.
   */
  getCityByCode: async (code, asObject = false) => {
    const baseUrl = isFrontEndCall
      ? process.env.NEXT_PUBLIC_URL
      : process.env.SANITY_STUDIO_URL;
    try {
      const citiesSearch = await fetch(
        `${baseUrl}/api/cities/byCode?code=${code}`,
        {
          method: "GET",
          next: {
            revalidate: CACHE.revalidation.cities,
          },
          headers: ApiUtils.getCommonHeaders(),
        }
      );
      const citiesResponse = await citiesSearch.json();
      const mapResponse = citiesResponse.map(
        ({ _id, name, country_name, iata_code, description, images }) => ({
          id: _id,
          name,
          description,
          label: `${name}, ${country_name}`,
          value: iata_code,
          images,
        })
      );

      return asObject ? mapResponse[0] : mapResponse;
    } catch (error) {
      return { error: error.message };
    }
  },
  getCitiesAutocompleteApi: async (query, inputName) => {
    const baseUrl = isFrontEndCall
      ? process.env.NEXT_PUBLIC_URL
      : process.env.SANITY_STUDIO_URL;

    try {
      const response = await fetch(
        `${baseUrl}/api/cities/autocomplete?query=${query}&input=${inputName}`,
        {
          method: "GET",
          headers: {
            ...ApiUtils.getCommonHeaders(),
            Origin: process.env.SANITY_STUDIO_URL, // Enviar el origen correcto
          },
          mode: "cors",
        }
      );

      // Verificar si la respuesta es exitosa (status 200-299)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Asegurarse de que la respuesta tenga un body antes de convertirlo a JSON
      const text = await response.text();
      if (!text) {
        throw new Error("Error: La respuesta está vacía");
      }

      const citiesResponse = JSON.parse(text);
      return citiesResponse;
    } catch (error) {
      console.error("Error fetching cities:", error);
      return { error: "Error fetching cities" }; // Manejo de error en caso de falla
    }
  },
};
