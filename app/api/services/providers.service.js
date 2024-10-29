/* const PROVIDERS = [
  {
    id: "julia",
    label: "Julia Tours",
    active: 1,
    policies: {
      //  availChunkQty: 7,
    },
  },
  { id: "plum", label: "Plum Viajes", active: 1 },
]; */

import { CitiesService } from "../../services/cities.service";
import { ApiUtils } from "./apiUtils.service";

/**
 * @typedef {Object} AvailResponseConfig
 * @property {Object} id
 * @property {Object} title
 * @property {Object} subtitle
 * @property {Object} nights
 * @property {Object} hotels
 * @property {Object} thumbnails
 * @property {Object} prices
 * @property {Object} departures
 */

/**
 * @typedef {Object}
 * @property {AvailResponseConfig} availResponseConfig
 * @property {Function} getPkgAvailability
 * @property {Function} getSearchEngineDefaultValues
 * @property {Function} getPkgDetail
 * @property {Function} departureDateMonthYear
 * @property {Function} departureDateFromTo
 * @property {Function} hasNestedProperty
 * @property {Function} getByDotOperator
 * @property {Function} mapper
 * @property {Object} julia
 * @property {Object} ola
 */

/**
 * Service for handling Plum Viajes related operations
 * @type {Object}
 */
export const PlumViajesService = {
  aFunction: () => {},
};

/**
 * Service for handling provider-related operations
 * @type {ProviderService}
 */
export const ProviderService = {
  availResponseConfig: {
    id: {
      plum: "_id",
      julia: "IDPAQUETE",
      ola: "Package.Code",
    },
    title: {
      plum: "title",
      julia: "NOMBRE",
      ola: "Package.Name",
    },
    subtitle: {
      plum: "subtitle",
      julia: "subtitle",
      ola: "Package.Description",
    },
    nights: {
      plum: "nights",
      julia: "CANTNOCHES",
      ola: "Package.Nights",
    },
    hotels: {
      name: {
        plum: "departures.[0].hotels",
        julia: "hotels",
        ola: "Descriptions.Description.Name",
      },
      rating: {
        plum: "departures.[0].hotels.rating",
        julia: "rating",
        ola: "Descriptions.Description.HotelClass",
      },
      mealPlan: {
        plum: "departures.[0].mealPlan",
        julia: "hotels",
        ola: "Descriptions.Description.FareDescriptions.FareDescription.[1].$value",
      },
      roomType: {
        plum: "departures.[0].roomType",
        julia: "hotels",
        ola: "Descriptions.Description.FareDescriptions.FareDescription.[0].$value",
      },
      roomSize: {
        plum: "departures.[0].prices.[0].type",
        julia: "hotels",
        ola: "Descriptions.Description.FareDescriptions.FareDescription.[2].$value",
      },
    },
    thumbnails: {
      plum: "images",
      ola: "Package.Pictures.Picture.[].$value",
    },
    prices: {
      pricesDetail: {
        basePrice: {
          plum: "departures.[0].prices.[0].amount",
          julia: "prices",
          ola: "FareTotal.Net",
        },
        currency: {
          plum: "departures.[0].prices.[0].currency",
          julia: "prices",
          ola: "FareTotal.Currency",
        },
        comission: {
          plum: "default",
          julia: "prices",
          ola: "FareTotal.Comission",
        },
      },
      taxes: {
        baseTax: {
          plum: "departures.[0].prices.[0].taxes",
          julia: "prices",
          ola: "FareTotal.Tax",
        },
        iva: {
          plum: "departures.[0].prices.[0].iva",
          julia: "prices",
          ola: "FareTotal.Vat",
        },
        ivaAgency: {
          plum: "departures.[0].prices.[0].ivaAgency",
          julia: "prices",
          ola: "FareTotal.VatAgency",
        },
        paisTax: {
          plum: "departures.[0].prices.[0].paisTax",
          julia: "prices",
          ola: "FareTotal.R3450.$value",
        },
        additionalTax: {
          description: {
            plum: "prices",
            julia: "prices",
            ola: "Taxes.Tax.Name",
          },
          value: {
            plum: "departures.[0].prices.[0].other",
            julia: "prices",
            ola: "Taxes.Tax.Value",
          },
        },
      },
    },
    departures: {
      plum: "departures",
      julia: "departures",
      ola: "departures",
    },
  },
  detailResponseConfig: {
    id: {
      plum: "_id",
      julia: "IDPAQUETE",
      ola: "Package.Code",
    },
    title: {
      plum: "title",
      julia: "NOMBRE",
      ola: "Package.Name",
    },
    subtitle: {
      plum: "subtitle",
      julia: "subtitle",
      ola: "Package.Description",
    },
    nights: {
      plum: "nights",
      julia: "CANTNOCHES",
      ola: "Package.Nights",
    },
    hotels: {
      // TODO: A esto le hace falta poder devolver un array de hotels con las sub propiedades. Es decir > 1 hotel con su id, name, rating, mealPlan, etc...
      id: {
        // TODO: No debería acceder al [0].id, ahí es donde debemos tener en realidad un array de estos valores ya accedidos.
        plum: "departures.[0].hotels.[0].id",
        julia: "hotels",
        ola: "Descriptions.Description.Name",
      },
      name: {
        plum: "departures.[0].hotels.[0].name",
        julia: "hotels",
        ola: "Descriptions.Description.Name",
      },
      rating: {
        plum: "departures.[0].hotels",
        julia: "rating",
        ola: "Descriptions.Description.HotelClass",
      },
      mealPlan: {
        plum: "departures.[0].mealPlan",
        julia: "hotels",
        ola: "Descriptions.Description.FareDescriptions.FareDescription.[1].$value",
      },
      roomType: {
        plum: "departures.[0].roomType",
        julia: "hotels",
        ola: "Descriptions.Description.FareDescriptions.FareDescription.[0].$value",
      },
      roomSize: {
        plum: "departures.[0].prices.[0].type",
        julia: "hotels",
        ola: "Descriptions.Description.FareDescriptions.FareDescription.[2].$value",
      },
    },
    images: {
      plum: "images",
      ola: "Package.Pictures.Picture.[].$value",
    },
    prices: {
      pricesDetail: {
        basePrice: {
          plum: "departures.[0].prices.[0].amount",
          julia: "prices",
          ola: "FareTotal.Net",
        },
        currency: {
          plum: "departures.[0].prices.[0].currency",
          julia: "prices",
          ola: "FareTotal.Currency",
        },
        comission: {
          plum: "default",
          julia: "prices",
          ola: "FareTotal.Comission",
        },
      },
      taxes: {
        baseTax: {
          plum: "departures.[0].prices.[0].taxes",
          julia: "prices",
          ola: "FareTotal.Tax",
        },
        iva: {
          plum: "departures.[0].prices.[0].iva",
          julia: "prices",
          ola: "FareTotal.Vat",
        },
        ivaAgency: {
          plum: "departures.[0].prices.[0].ivaAgency",
          julia: "prices",
          ola: "FareTotal.VatAgency",
        },
        paisTax: {
          plum: "departures.[0].prices.[0].paisTax",
          julia: "prices",
          ola: "FareTotal.R3450.$value",
        },
        additionalTax: {
          description: {
            plum: "prices",
            julia: "prices",
            ola: "Taxes.Tax.Name",
          },
          value: {
            plum: "departures.[0].prices.[0].other",
            julia: "prices",
            ola: "Taxes.Tax.Value",
          },
        },
      },
    },
    departures: {
      plum: "departures",
      julia: "departures",
      ola: "departures",
    },
  },

  /**
   * Fetches package availability based on search parameters
   * @async
   * @param {Object} searchParams - The search parameters
   * @returns {Promise<Object>} The package availability data
   * @throws {Error} If the fetch request fails
   */
  getPkgAvailability: async (searchParams) => {
    const pkgAvailabilityRequest = await fetch(
      `${process.env.URL}/api/packages/availability`,
      {
        method: "POST",
        body: JSON.stringify({ searchParams }),
        next: { revalidate: 0 },
        headers: ApiUtils.getCommonHeaders(),
      }
    );

    if (!pkgAvailabilityRequest.ok) {
      const response = await pkgAvailabilityRequest.json();
      // This will activate the closest `error.js` Error Boundary
      throw new Error(
        `Ocurrió un error en el avail de paquetes. Razón: ${response.reason}`
      );
    }

    return pkgAvailabilityRequest.json();
  },

  /**
   * Fetches package detail based on provider and id
   * @async
   * @param {string} provider - The provider identifier
   * @param {string} id - The package identifier
   * @returns {Promise<Object>} The package detail data
   * @throws {Error} If the fetch request fails
   */
  getPkgDetail: async ({ provider, id }) => {
    const pkgDetailRequest = await fetch(
      `${process.env.URL}/api/packages/detail`,
      {
        method: "POST",
        body: JSON.stringify({ provider, id }),
        next: { revalidate: 0 },
        headers: ApiUtils.getCommonHeaders(),
      }
    );

    if (!pkgDetailRequest.ok) {
      const response = await pkgDetailRequest.json();
      // This will activate the closest `error.js` Error Boundary
      throw new Error(
        `Ocurrió un error en el detail de paquetes. Razón: ${response.reason}`
      );
    }

    return pkgDetailRequest.json();
  },

  /**
   * Generates departure date options for the current month and year
   * @param {string} [startDate] - Optional start date in 'YYYY-MM-DD' format
   * @returns {Array<Object>} Array of departure date options
   */
  departureDateMonthYear: (startDate) => {
    const currentDate = startDate ? new Date(startDate) : new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = startDate
      ? parseInt(startDate.split("-")[1]) - 1
      : currentDate.getMonth();

    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    if (startDate) {
      const monthIndex = currentMonth;
      const monthNumber = monthIndex + 1;
      const monthString = monthNumber.toString().padStart(2, "0");
      const value = `${monthString}-${currentYear}`;

      return {
        id: monthNumber,
        value: value,
        label: `${months[monthIndex]}, ${currentYear}`,
      };
    }

    return months
      .map((month, index) => {
        const monthNumber = index + 1;
        const monthString = monthNumber.toString().padStart(2, "0");
        const value = `${monthString}-${currentYear}`;

        return {
          id: monthNumber,
          value,
          label: `${month}, ${currentYear}`,
        };
      })
      .filter((_, index) => index >= currentMonth);
  },

  /**
   * Generates start and end dates for a given month and year
   * @param {string} monthYear - Month and year in 'MM-YYYY' format
   * @returns {Object|null} Object with startDate and endDate, or null if invalid input
   */
  departureDateFromTo: (monthYear) => {
    if (!monthYear) return null;
    const [month, year] = monthYear.split("-");
    const currentMonthLastDay = new Date(year, month, 0).getDate();
    return {
      startDate: `01-${month}-${year}`,
      endDate: `${currentMonthLastDay}-${month}-${year}`,
    };
  },

  /**
   * Checks if a string contains nested properties (indicated by dots)
   * @param {string} string - The string to check
   * @returns {boolean} True if the string contains nested properties, false otherwise
   */
  hasNestedProperty: (string) => {
    return string.includes(".");
  },

  /**
   * Retrieves a value from an object using a dot-separated string path
   * @param {Object} object - The object to search in
   * @param {string} value - The dot-separated path to the desired property
   * @returns {*} The value at the specified path, or undefined if not found
   */
  getByDotOperator(object, value) {
    if (!object || !value) return null;
    const reduced = value.split(".").reduce((acc, curr) => {
      if (curr === "[]") {
        // Handle array case
        return Array.isArray(acc) ? acc : [];
      } else if (/^\[\d+\]$/.test(curr)) {
        // Handle array index case
        return Array.isArray(acc) ? acc[curr.slice(1, -1)] : [];
      } else if (Array.isArray(acc)) {
        // If acc is an array, map the property access to all elements
        return acc.map((item) => item[curr]);
      } else {
        return acc ? acc[curr] : undefined;
      }
    }, object);

    return reduced;
  },

  /**
   * Maps the response data according to the provider's configuration
   * @param {Array} response - The response data to map
   * @param {string} provider - The provider identifier
   * @returns {Array} The mapped response data
   */
  mapper: (response, provider, consumer) => {
    if (response.length === 0) return response;
    //if (provider === "plum") return response;
    const respConfig =
      consumer === "detail"
        ? ProviderService.detailResponseConfig
        : ProviderService.availResponseConfig;

    const mapNestedObject = (pkg, configObj) => {
      let result = {};
      Object.entries(configObj).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          if (value[provider]) {
            // Handle the current scenario where the provider key exists directly
            const providerConfigProp = value[provider];
            if (ProviderService.hasNestedProperty(providerConfigProp)) {
              result[key] = ProviderService.getByDotOperator(
                pkg,
                providerConfigProp
              );
            } else {
              result[key] = pkg[providerConfigProp];
            }
          } else {
            // Recursively map nested objects
            result[key] = mapNestedObject(pkg, value);
          }
        } else {
          // This case should not occur in the current structure, but kept for safety
          console.warn(`Unexpected value type for key ${key}:`, value);
        }
      });
      return result;
    };

    const mappedResponse = response.map((pkg) => {
      let mappedPkg = mapNestedObject(pkg, respConfig);
      mappedPkg.provider = provider;
      return mappedPkg;
    });

    return mappedResponse;
  },
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
        departureMonthYear: ProviderService.departureDateMonthYear(startDate),
        arrivalCity: arrivalCityData,
        departureCity: departureCityData,
      },
    };
  },

  getHotelDetailInfo: async () => {},

  julia: {},

  ola: {
    /**
     * Converts a date from DD-MM-YYYY format to YYYY-MM-DD format
     * @param {string} dayMonthYear - Date in DD-MM-YYYY format
     * @returns {string} Date in YYYY-MM-DD format
     */
    olaDateFormat: (dayMonthYear) => {
      const [day, month, year] = dayMonthYear.split("-");
      return `${year}-${month}-${day}`;
    },

    /**
     * This function groups the mapped response by unique keys.
     * It removes duplicate packages based on specific criteria.
     *
     * @param {Array} mappedResponse - The array of mapped response objects.
     * @returns {Array} - The array of unique response objects.
     */
    grouper: (mappedResponse) => {
      const uniqueResponse = [];
      const seenItems = new Set();

      mappedResponse.forEach((item) => {
        const uniqueKey = `${item.id}-${item.hotels.name}-${item.hotels.roomType}-${item.hotels.roomSize}-${item.hotels.mealPlan}`;
        if (!seenItems.has(uniqueKey)) {
          seenItems.add(uniqueKey);
          uniqueResponse.push(item);
        }
      });

      return uniqueResponse;
    },
  },
};
