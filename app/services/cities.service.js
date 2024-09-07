export const CitiesService = {
  getCityByCode: async (code, asObject = false) => {
    try {
      const citiesSearch = await fetch(
        `${process.env.URL}/api/cities/byCode?code=${code}`,
        {
          method: "GET",
          //cache: "no-cache",
        }
      );
      const citiesResponse = await citiesSearch.json();

      const mapResponse = citiesResponse.map(
        ({ id, name, label, countryName }) => ({
          id,
          name,
          label: `${label}, ${countryName}`,
          value: id,
        })
      );

      return asObject ? mapResponse[0] : mapResponse;
    } catch (error) {
      return { error: error.message };
    }
  },
};
