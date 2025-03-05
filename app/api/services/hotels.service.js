import { groq } from "next-sanity";
import SanityService from "./sanity.service";

export const Hotels = {
  get: () => SanityService.getFromSanity(`*[_type == "hotel"]`),
  getById: (id) =>
    SanityService.getFromSanity(groq`*[_type == "hotel" && _id == "${id}"] {
      ...,
      "images": coalesce(images[].asset->url, []),
      "city": city_id-> {
          iata_code,
          name,
          country_name
        }
      }`),
  getByNameIlike: (name) =>
    SanityService.getFromSanity(groq`*[_type == "hotel" && name match "${name}"] {
      ...,
      "images": coalesce(images[].asset->url, []),
       "city": city_id-> {
          iata_code,
          name,
          country_name
        }
          }`),
};
