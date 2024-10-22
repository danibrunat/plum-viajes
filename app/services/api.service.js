import { ApiUtils } from "../api/services/apiUtils.service";
import DatabaseService from "../api/services/database.service";
import { Hotels } from "../api/services/hotels.service";

const baseUrl = process.env.URL;

export const Api = {
  packages: {
    avail: {
      pbase: {
        url: () => `${baseUrl}/api/packages/availability/pbase`,
        options: (body) => ({
          body: JSON.stringify(body),
          method: "POST",
          headers: ApiUtils.getCommonHeaders(),
        }),
        name: "POST Availability | pbase",
      },
    },
    detail: {
      pbase: {
        url: () => `${baseUrl}/api/packages/detail/pbase`,
        options: (body) => ({
          body: JSON.stringify(body),
          method: "POST",
          headers: ApiUtils.getCommonHeaders(),
        }),
        name: "POST Detail | pbase",
      },
    },
  },
  hotels: {
    get: {
      url: () => `${baseUrl}/api/hotels`,
      options: () => ({
        method: "GET",
        headers: ApiUtils.getCommonHeaders(),
      }),
      name: "GET Hotels",
    },
    getById: {
      url: (id) => `${baseUrl}/api/hotel/${id}`,
      options: () => ({
        method: "GET",
        headers: ApiUtils.getCommonHeaders(),
      }),
      name: `GET Hotel ID `,
    },
  },
};
