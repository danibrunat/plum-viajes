import { ApiUtils } from "../api/services/apiUtils.service";

const baseUrl = process.env.NEXT_PUBLIC_URL; // URL para Next.js o Frontend

export const Api = {
  packages: {
    avail: {
      pcom: {
        url: () => `${baseUrl}/api/packages/availability/pcom`,
        options: (body) => ({
          body: JSON.stringify(body),
          method: "POST",
          headers: ApiUtils.getCommonHeaders(),
        }),
        name: "POST Availability | pcom",
      },
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
      pcom: {
        url: () => `${baseUrl}/api/packages/detail/pcom`,
        options: (body) => ({
          body: JSON.stringify(body),
          method: "POST",
          headers: ApiUtils.getCommonHeaders(),
        }),
        name: "POST Detail | pcom",
      },
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
    getByName: {
      url: (name) => `${baseUrl}/api/hotels/byName?name=${name}`,
      options: () => ({
        method: "GET",
        headers: ApiUtils.getCommonHeaders(),
      }),
      name: `GET Hotel By Name `,
    },
  },
  cities: {
    getByCode: {
      url: (code) => `${baseUrl}/api/cities/byCode?code=${code}`,
      options: () => ({
        method: "GET",
        headers: ApiUtils.getCommonHeaders(),
      }),
    },
  },
  airlines: {
    get: {
      url: () => `${baseUrl}/api/airlines`,
      options: () => ({
        method: "GET",
        headers: ApiUtils.getCommonHeaders(),
      }),
      name: "GET airlines",
    },
    getById: {
      url: (id) => `${baseUrl}/api/airline/${id}`,
      options: () => ({
        method: "GET",
        headers: ApiUtils.getCommonHeaders(),
      }),
      name: `GET airline by ID `,
    },
  },
  landing: {
    destination: {
      getData: {
        url: () => `${baseUrl}/api/landing/destination`,
        options: (body) => ({
          method: "POST",
          body: JSON.stringify(body),
          headers: ApiUtils.getCommonHeaders(),
        }),
        name: "POST landing/destination",
      },
    },
  },
  crypto: {
    getDepartureId: {
      url: () => `${baseUrl}/api/crypto/departureId`,
      options: (body) => ({
        method: "POST",
        body: JSON.stringify(body),
        headers: ApiUtils.getCommonHeaders(),
      }),
      name: "POST Crypto / Departure Id",
    },
  },
};
