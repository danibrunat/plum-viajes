import {
  sanityCreate,
  sanityFetch,
  sanityDelete,
  sanityDeleteByQuery,
} from "../../lib/sanityFetch";
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
  deleteByIds: async (documentIds) => {
    const deleteResult = await ApiUtils.requestHandler(
      sanityDelete(documentIds),
      "Sanity delete by IDs"
    );
    return deleteResult;
  },
  deleteByQuery: async (query) => {
    const deleteResult = await ApiUtils.requestHandler(
      sanityDeleteByQuery(query),
      "Sanity delete by query"
    );
    return deleteResult;
  },
};

export default SanityService;
