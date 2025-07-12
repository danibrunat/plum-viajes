import { ApiUtils } from "../api/services/apiUtils.service";
import CACHE from "../constants/cachePolicies";

/**
 * Service for handling city-related operations.
 */
const CitiesService = {
  /**
   * Fetches city information by its code.
   *
   * @param {string} code - The code of the city to fetch.
   * @param {boolean} [asObject=false] - Whether to return the result as a single object.
   * @returns {Promise<Object|Array>} A promise that resolves to the city data, either as an object or an array.
   * @throws {Object} An error object if the fetch operation fails.
   */
  async getCityByCode(code, asObject = false) {
    const baseUrl = process.env.NEXT_PUBLIC_URL;
    try {
      const citiesSearch = await fetch(
        `${baseUrl}/api/cities/byCode?code=${code}`,
        {
          method: "GET",
          next: {
            revalidate: CACHE.REVALIDATION.cities,
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

  async getCitiesAutocompleteApi(query, inputName) {
    const baseUrl = process.env.NEXT_PUBLIC_URL;

    try {
      const response = await fetch(
        `${baseUrl}/api/cities/autocomplete?query=${query}&input=${inputName}`,
        {
          method: "GET",
          headers: {
            ...ApiUtils.getCommonHeaders(),
          },
          mode: "cors",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error("Error: La respuesta está vacía");
      }

      return JSON.parse(text);
    } catch (error) {
      console.error("Error fetching cities:", error);
      return { error: "Error fetching cities" };
    }
  },
};

export default CitiesService;
