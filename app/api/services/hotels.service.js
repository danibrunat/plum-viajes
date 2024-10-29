import DatabaseService from "./database.service";

export const Hotels = {
  get: () => DatabaseService.get("hotels"),
  getById: (id) =>
    DatabaseService.getByIdEqualAndCustomSelect(
      "hotels",
      `*, hotels_images (image_name)`,
      id
    ),
  getImagePublicUrl: (imagePath) =>
    DatabaseService.getStorageItemPublicUrl("hotel_images", imagePath),
};
