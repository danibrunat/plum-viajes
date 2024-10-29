import { ApiUtils } from "../api/services/apiUtils.service";
import DatabaseService from "../api/services/database.service";

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
    try {
      const citiesSearch = await fetch(
        `${process.env.URL}/api/cities/byCode?code=${code}`,
        {
          method: "GET",
          cache: "no-cache",
          headers: ApiUtils.getCommonHeaders(),
        }
      );
      const citiesResponse = await citiesSearch.json();
      console.log("citiesResponse", citiesResponse);
      const mapResponse = citiesResponse.map(
        ({
          id,
          name,
          country_name,
          region_name,
          iata_code,
          description,
          images,
        }) => ({
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
  getImagePublicUrl: (imagePath) =>
    DatabaseService.getStorageItemPublicUrl("city_images", imagePath),
};
