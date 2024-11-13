import CACHE from "../../constants/cachePolicies";
import { ApiUtils } from "./apiUtils.service";
import XmlService from "./xml.service";

const isSanity = typeof process.env.URL == "undefined"; // Desde Sanity no existen las variables no prefijadas en SANITY_STUDIO_

const baseUrl = isSanity
  ? process.env.SANITY_STUDIO_URL // URL para Sanity
  : process.env.URL; // URL para Next.js o Frontend

export const OLA = {
  avail: {
    url: () => `${baseUrl}/api/providers/ola/avail`,
    options: (body, cacheKey) => {
      return {
        body: JSON.stringify(body),
        method: "POST",
        headers: ApiUtils.getCommonHeaders(),
        next: {
          revalidate: 10000,
        },
      };
    },
    name: "POST Availability | OLA",
  },
  detail: {
    url: () => `${baseUrl}/api/providers/ola/detail`,
    options: (body, cacheKey) => {
      console.log("cacheKey", cacheKey);
      return {
        body: JSON.stringify(body),
        method: "POST",
        headers: ApiUtils.getCommonHeaders(),
      };
    },
    name: "POST Detail | OLA",
  },
  getHotelsOla: async (request) => {
    // console.log("avail request", request);
    try {
      const url = process.env.OLA_URL;
      const getHotelsOlaRequest = await XmlService.soap.request(
        url,
        request,
        "GetHotelsOla"
      );
      //console.log("getHotelsOlaRequest", getHotelsOlaRequest);
      return getHotelsOlaRequest;
    } catch (error) {
      return error;
    }
  },
  getPackagesFaresDepartureDates: async (request) => {
    // console.log("avail request", request);
    try {
      const url = process.env.OLA_URL;
      const getPackagesFaresDepartureDatesRequest =
        await XmlService.soap.request(
          url,
          request,
          "GetPackagesFaresDepartureDates"
        );
      //console.log("getPackagesFaresDepartureDatesRequest", getPackagesFaresDepartureDatesRequest);
      return getPackagesFaresDepartureDatesRequest;
    } catch (error) {
      return error;
    }
  },
};
