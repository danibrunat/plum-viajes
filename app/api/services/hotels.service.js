import DatabaseService from "./sanity.service";

export const Hotels = {
  get: () => DatabaseService.get("hotels"),
  getById: (id) =>
    DatabaseService.getByIdEqualAndCustomSelect("hotels", `*`, id),
  getByNameIlike: (name) =>
    DatabaseService.getByFieldIlikeAndCustomSelect("hotels", "name", name, `*`),
  getImagePublicUrl: (imagePath) =>
    DatabaseService.getStorageItemPublicUrl("hotel_images", imagePath),
  getImagesForHotel: (hotelId) =>
    DatabaseService.listImagesFromBucketNestedFolder("hotel_images", hotelId),
};
