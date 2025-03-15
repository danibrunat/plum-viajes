import CitiesService from "../../app/services/cities.service";

export const getCitiesAutocompleteApi = async (query, inputName) => {
  return await CitiesService.getCitiesAutocompleteApi(query, inputName);
};

export const loadOptions = async (inputValue, _, inputName) => {
  if (inputValue.length < 4) {
    return [];
  }
  try {
    const citiesFetch = await getCitiesAutocompleteApi(inputValue, inputName);
    const formattedOptions = citiesFetch.map((city) => ({
      label: `${city.label}`,
      value: city.value,
    }));
    return formattedOptions;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};
