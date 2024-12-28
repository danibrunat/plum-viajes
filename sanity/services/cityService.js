import { CitiesService } from "../../app/services/cities.service";

export const getCitiesAutocompleteApi = async (query, inputName) => {
  return await CitiesService.getCitiesAutocompleteApi(query, inputName);
};

export const loadOptions = async (query, callback, inputName) => {
  if (query.length >= 3) {
    const citiesFetch = await getCitiesAutocompleteApi(query, inputName);
    await callback(citiesFetch);
  }
};
