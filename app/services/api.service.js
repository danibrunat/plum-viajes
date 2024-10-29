import { ApiUtils } from "../api/services/apiUtils.service";

const isSanity = typeof process.env.URL == "undefined"; // Desde Sanity no existen las variables no prefijadas en SANITY_STUDIO_

const baseUrl = isSanity
  ? process.env.SANITY_STUDIO_URL // URL para Sanity
  : process.env.URL; // URL para Next.js o Frontend

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
