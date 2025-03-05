import { sanityCreate, sanityFetch } from "../../../sanity/lib/sanityFetch";
import { ApiUtils } from "./apiUtils.service";

// Database service object containing various methods for database operations
const SanityService = {
  // Method to get all records from a specified table
  getFromSanity: async (query) => {
    const sanityQuery = await ApiUtils.requestHandler(
      sanityFetch({ query }),
      "Sanity fetch"
    );
    const response = await sanityQuery;
    return response;
  },
  createObject: async (object) => {
    const create = await ApiUtils.requestHandler(
      sanityCreate(object),
      "Sanity create"
    );
    const response = await create;
    return response;
  },
};

export default SanityService;
