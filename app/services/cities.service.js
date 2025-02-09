import { ApiUtils } from "../api/services/apiUtils.service";
import DatabaseService from "../api/services/database.service";
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
        ({ id, name, country_name, iata_code, description, images }) => ({
          id,
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
    const cities = await ApiUtils.requestHandler(
      fetch(
        `${baseUrl}/api/cities/autocomplete?query=${query}&input=${inputName}`,
        {
          method: "GET",
          headers: ApiUtils.getCommonHeaders(),
        }
      ),
      "getCitiesAutocompleteApi"
    );
    const citiesResponse = await cities.json();
    return citiesResponse;
  },
  getImagePublicUrl: (imagePath) =>
    DatabaseService.getStorageItemPublicUrl("city_images", imagePath),
};
