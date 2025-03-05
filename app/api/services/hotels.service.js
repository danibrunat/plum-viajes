import SanityService from "./sanity.service";

export const Hotels = {
  get: () => SanityService.getFromSanity(`*[_type == "hotel"]`),
  getById: (id) =>
    SanityService.getFromSanity(`*[_type == "hotel" && _id == "${id}"] {
      ...,
       "city": city_id-> {
          iata_code,
          name,
          country_name
        }
      }`),
  getByNameIlike: (name) =>
    SanityService.getFromSanity(`*[_type == "hotel" && name match "${name}"] {
      ...,
       "city": city_id-> {
          iata_code,
          name,
          country_name
        }
          }`),
  getImagePublicUrl: (imagePath) =>
    SanityService.getStorageItemPublicUrl("hotel_images", imagePath),
  getImagesForHotel: (hotelId) =>
    SanityService.listImagesFromBucketNestedFolder("hotel_images", hotelId),
};
