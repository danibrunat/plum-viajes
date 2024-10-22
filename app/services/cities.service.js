import { ApiUtils } from "../api/services/apiUtils.service";

export const CitiesService = {
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
      const mapResponse = citiesResponse.map(
        ({ id, name, country_name, region_name, iata_code }) => ({
          id,
          name,
          label: `${name}, ${country_name}`,
          value: iata_code,
        })
      );

      return asObject ? mapResponse[0] : mapResponse;
    } catch (error) {
      return { error: error.message };
    }
  },
};
