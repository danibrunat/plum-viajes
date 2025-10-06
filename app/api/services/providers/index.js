import { hasNestedProperty, getByDotOperator } from "./utils/object.js";
import { mapProviderResponse } from "./utils/mapper.js";
import { OlaProvider } from "./providers/ola.js";
import { JuliaProvider } from "./providers/julia.js";
import { PlumProvider } from "./providers/plum.js";
import {
  departureDateMonthYear,
  departureDateFromTo,
} from "../datesService.js";
import { getPkgAvailabilityAndFilters } from "../availabilityService.js";
import { getPkgDetail } from "../detailService.js";
import CitiesService from "../../../services/cities.service.js";
import availResponseConfig from "./config/availConfig.js";
import detailResponseConfig from "./config/detailConfig.js";

/**
 * Service for handling Plum Viajes related operations
 */
export const PlumViajesService = {
  aFunction: () => {},
};

/**
 * Service for handling provider-related operations
 */
export const ProviderService = {
  availResponseConfig,
  detailResponseConfig,

  /**
   * Maps the response data according to the provider's configuration
   */
  mapper: (response, provider, consumer) =>
    mapProviderResponse(
      response,
      provider,
      availResponseConfig,
      detailResponseConfig,
      consumer
    ),

  // API Services
  getPkgAvailabilityAndFilters,
  getPkgDetail,

  // Date Services
  departureDateMonthYear,
  departureDateFromTo,

  // Utility functions
  hasNestedProperty,
  getByDotOperator,

  /**
   * Gets default values for search engine
   */
  getSearchEngineDefaultValues: async (
    startDate,
    arrivalCity,
    departureCity
  ) => {
    const [arrivalCityData, departureCityData] = await Promise.all([
      CitiesService.getCityByCode(arrivalCity, true),
      CitiesService.getCityByCode(departureCity, true),
    ]);

    return {
      packages: {
        departureMonthYear: departureDateMonthYear(startDate),
        arrivalCity: arrivalCityData,
        departureCity: departureCityData,
      },
    };
  },

  /**
   * Parses room configuration string
   */
  getRoomsConfig: (configString) => {
    if (!configString || configString.trim() === "") return [];

    return configString.split(",").map((room) => {
      const [adultsPart, childrenPart] = room.split("|");
      const adults = parseInt(adultsPart, 10) || 0;
      const children = childrenPart ? childrenPart.split("-").map(Number) : [];

      return { adults, children };
    });
  },

  getHotelDetailInfo: async () => {},

  // Provider-specific services
  julia: JuliaProvider,
  ola: OlaProvider,
  plum: PlumProvider,

  /**
   * Helper for fetch with json response
   */
  clientFetch: (...args) => fetch(...args).then((res) => res.json()),
};
