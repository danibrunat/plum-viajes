import DatabaseService from "./database.service";

export const Airlines = {
  get: () => DatabaseService.get("airlines"),
  getByAirlineCode: (field) =>
    DatabaseService.getAllByFieldEqual("airlines", "code", field),
  getLogoPublicUrl: (logoName) =>
    DatabaseService.getStorageItemPublicUrl("airlines_images", logoName),
  /* getImagePublicUrl: (imagePath) =>
    DatabaseService.getStorageItemPublicUrl("hotel_images", imagePath), */
};
