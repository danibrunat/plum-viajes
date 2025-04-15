import CitiesService from "../../services/cities.service";
import { ApiUtils } from "./apiUtils.service";

// Utility functions - defined once outside to prevent recreating on each call
/**
 * Checks if a value is a non-null object
 * @param {*} value - The value to check
 * @returns {boolean} - True if value is an object
 */
const isObject = (value) => value !== null && typeof value === "object";

/**
 * Checks if a string contains nested properties (indicated by dots)
 * @param {string} string - The string to check
 * @returns {boolean} - True if the string contains dots
 */
const hasNestedProperty = (string) => string && string.includes(".");

/**
 * Retrieves a value from an object using a dot-separated string path
 * @param {Object} object - The object to search in
 * @param {string} path - The dot-separated path to the desired property
 * @param {boolean} isArray - Whether to return array or first element
 * @returns {*} - The value at the specified path, or undefined if not found
 */
const getByDotOperator = (object, path, isArray = false) => {
  if (!object || !path) return null;

  const reduced = path.split(".").reduce((acc, curr) => {
    // Handle array indices like "[0]", "[1]"
    if (/^\[\d+\]$/.test(curr)) {
      const index = parseInt(curr.slice(1, -1), 10);
      return Array.isArray(acc) ? acc[index] : undefined;
    }
    // Handle "[]" notation
    else if (curr === "[]") {
      if (Array.isArray(acc) && isArray) {
        return acc.map((item) => item);
      } else {
        return Array.isArray(acc) ? acc[0] : acc;
      }
    }
    // Handle arrays by mapping over elements
    else if (Array.isArray(acc)) {
      return acc.map((item) => (item ? item[curr] : undefined));
    }
    // Regular property access
    else {
      return acc ? acc[curr] : undefined;
    }
  }, object);

  // If result is an array with a single value, return that value unless isArray is true
  if (Array.isArray(reduced) && reduced.length === 1 && !isArray) {
    return reduced[0];
  }

  return reduced;
};

/**
 * Maps nested object structure according to configuration
 * @param {Object} pkg - Source package data
 * @param {Object} configObj - Mapping configuration
 * @param {string} provider - Provider identifier
 * @returns {Object} - Mapped object
 */
const mapNestedObject = (
  pkg,
  configObj,
  provider,
  getByDotOperatorFn,
  hasNestedPropertyFn
) => {
  let result = {};

  Object.entries(configObj).forEach(([key, value]) => {
    if (value.isArray) {
      let arrayData = [];
      if (value.baseKey && value.baseKey[provider]) {
        const baseKeyValue = value.baseKey[provider].trim();
        if (baseKeyValue === "@self" || baseKeyValue === "continue") {
          arrayData = pkg;
        } else {
          arrayData = getByDotOperatorFn(pkg, baseKeyValue) || [];
        }
      } else {
        arrayData = pkg[key];
      }

      if (arrayData === undefined || arrayData === null) {
        arrayData = [];
      } else if (!Array.isArray(arrayData)) {
        arrayData = [arrayData];
      }

      result[key] = arrayData.map((item) =>
        isObject(item)
          ? mapNestedObject(
              item,
              value.items,
              provider,
              getByDotOperatorFn,
              hasNestedPropertyFn
            )
          : item
      );
      return;
    }

    if (isObject(value) && !value[provider]) {
      result[key] = mapNestedObject(
        pkg,
        value,
        provider,
        getByDotOperatorFn,
        hasNestedPropertyFn
      );
      return;
    }

    if (!isObject(value) || !value[provider]) {
      // Skip warning for performance in production
      return;
    }

    const providerConfigProp = value[provider];
    result[key] = hasNestedPropertyFn(providerConfigProp)
      ? getByDotOperatorFn(pkg, providerConfigProp)
      : pkg[providerConfigProp];
  });

  return result;
};

// Months array - defined once to avoid recreation
const MONTHS = [
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
    thumbnails: {
      isArray: true,
      baseKey: {
        ola: "Package.Pictures.Picture",
        plum: "images",
      },
      items: {
        sourceUrl: {
          plum: "asset",
          ola: "$value",
        },
      },
    },
    departures: {
      isArray: true,
      baseKey: {
        plum: "departures",
        ola: "@self",
      },
      items: {
        id: {
          plum: "id",
          ola: "id",
        },
        hotels: {
          isArray: true,
          baseKey: {
            plum: "@self",
            ola: "Descriptions",
          },
          items: {
            id: {
              plum: "hotels.[0].id",
              julia: "hotels",
              ola: "Description.Name",
            },
            name: {
              plum: "hotels.[0].name",
              julia: "hotels",
              ola: "Description.Name",
            },
            rating: {
              plum: "hotels.[0].rating",
              julia: "rating",
              ola: "Description.HotelClass",
            },
            mealPlan: {
              plum: "mealPlan",
              julia: "hotels",
              ola: "Description.FareDescriptions.FareDescription.[1].$value",
            },
            roomType: {
              plum: "prices.[0].type",
              julia: "hotels",
              ola: "Description.FareDescriptions.FareDescription.[0].$value",
            },
            roomSize: {
              plum: "roomSize",
              julia: "hotels",
              ola: "Description.FareDescriptions.FareDescription.[2].$value",
            },
          },
        },
        prices: {
          id: {
            plum: "1234",
            ola: "FareCodes.FareOption",
          },
          pricesDetail: {
            basePrice: {
              plum: "prices.[0].amount",
              julia: "prices",
              ola: "FareTotal.Net",
            },
            currency: {
              plum: "prices.[0].currency",
              julia: "prices",
              ola: "FareTotal.Currency",
            },
            comission: {
              plum: "prices.[0].amount",
              julia: "prices",
              ola: "FareTotal.Comission",
            },
          },
          taxes: {
            baseTax: {
              plum: "prices.[0].taxes",
              julia: "prices",
              ola: "FareTotal.Tax",
            },
            iva: {
              plum: "prices.[0].iva",
              julia: "prices",
              ola: "FareTotal.Vat",
            },
            ivaAgency: {
              plum: "prices.[0].ivaAgency",
              julia: "prices",
              ola: "FareTotal.VatAgency",
            },
            paisTax: {
              plum: "prices.[0].paisTax",
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
                plum: "prices.[0].other",
                julia: "prices",
                ola: "Taxes.Tax.Value",
              },
            },
          },
        },
        date: {
          plum: "departureFrom",
          ola: "Flight.Trips.Trip.[0].DepartureDate",
        },
        seats: {
          plum: "departureSeats",
          ola: "departureSeats",
        },
      },
    },
    specialOfferTags: {
      plum: "specialOfferTags",
      julia: "specialOfferTags",
      ola: "Package.Tags.Tag",
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
    description: {
      plum: "longDescription",
      julia: "description",
      ola: "Package.Description",
    },
    nights: {
      plum: "nights",
      julia: "CANTNOCHES",
      ola: "Package.Nights",
    },
    images: {
      isArray: true,
      baseKey: {
        ola: "Package.Pictures.Picture",
        plum: "images",
      },
      items: {
        sourceUrl: {
          plum: "asset",
          ola: "$value",
        },
      },
    },
    departures: {
      isArray: true,
      baseKey: {
        plum: "departures",
        ola: "@self",
      },
      items: {
        id: {
          plum: "departureId",
          ola: "departureId",
        },
        hotels: {
          isArray: true,
          baseKey: {
            plum: "@self",
            ola: "Descriptions",
          },
          items: {
            id: {
              plum: "hotels.[].id",
              julia: "hotels",
              ola: "Description.Name",
            },
            name: {
              plum: "hotels.[].name",
              julia: "hotels",
              ola: "Description.Name",
            },
            description: {
              plum: "hotels.[].description",
              ola: "Description.Description",
            },
            rating: {
              plum: "hotels.[].rating",
              julia: "rating",
              ola: "Description.HotelClass",
            },
            mealPlan: {
              plum: "mealPlan",
              julia: "hotels",
              ola: "Description.FareDescriptions.FareDescription.[1].$value",
            },
            roomType: {
              plum: "roomType",
              julia: "hotels",
              ola: "Description.FareDescriptions.FareDescription.[0].$value",
            },
            roomSize: {
              plum: "prices.[0].type",
              julia: "hotels",
              ola: "Description.FareDescriptions.FareDescription.[2].$value",
            },
          },
        },
        prices: {
          id: {
            plum: "1234",
            ola: "FareCodes.FareOption",
          },
          pricesDetail: {
            basePrice: {
              plum: "prices.[0].amount",
              julia: "prices",
              ola: "FareTotal.Net",
            },
            currency: {
              plum: "prices.[0].currency",
              julia: "prices",
              ola: "FareTotal.Currency",
            },
            comission: {
              plum: "prices.[0].amount",
              julia: "prices",
              ola: "FareTotal.Comission",
            },
          },
          taxes: {
            baseTax: {
              plum: "prices.[0].taxes",
              julia: "prices",
              ola: "FareTotal.Tax",
            },
            iva: {
              plum: "prices.[0].iva",
              julia: "prices",
              ola: "FareTotal.Vat",
            },
            ivaAgency: {
              plum: "prices.[0].ivaAgency",
              julia: "prices",
              ola: "FareTotal.VatAgency",
            },
            paisTax: {
              plum: "prices.[0].paisTax",
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
                plum: "prices.[0].other",
                julia: "prices",
                ola: "Taxes.Tax.Value",
              },
            },
          },
        },
        flights: {
          isArray: true,
          baseKey: {
            ola: "Flight.Trips.Trip",
            plum: "flights",
          }, // Define el arreglo base principal
          items: {
            segments: {
              isArray: true,
              baseKey: {
                ola: "Segments.Segment",
                plum: "segments",
              }, // Define el arreglo de segmentos dentro de cada trip
              items: {
                flightNumber: {
                  ola: "FlightNumber",
                  plum: "flightNumber",
                },
                departureDate: {
                  ola: "DepartureDate",
                  plum: "departureDate",
                },
                departureHour: {
                  ola: "DepartureHour",
                  plum: "departureHour",
                },
                airline: {
                  code: {
                    ola: "Supplier.Code",
                    plum: "airline.code",
                  },
                  name: {
                    ola: "Supplier.Name",
                    plum: "airline.name",
                  },
                  logo: {
                    ola: "Supplier.Code",
                    plum: "airline.logoUrl",
                  },
                },
                arrivalDate: {
                  ola: "ArrivalDate",
                  plum: "arrivalDate",
                },
                arrivalHour: {
                  ola: "ArrivalHour",
                  plum: "arrivalHour",
                },
                departureAirport: {
                  code: {
                    ola: "DepartureAirport.attributes.Iata",
                    plum: "departureCity",
                  },
                  name: {
                    ola: "DepartureAirport.$value",
                    plum: "departureCity",
                  },
                },
                departureCity: {
                  code: {
                    ola: "DepartureCity.attributes.Iata",
                    plum: "departureCity",
                  },
                  name: {
                    ola: "DepartureCity.$value",
                    plum: "departureCity",
                  },
                },
                arrivalCity: {
                  code: {
                    ola: "ArrivalCity.attributes.Iata",
                    plum: "arrivalCity",
                  },
                  name: {
                    ola: "ArrivalCity.$value",
                    plum: "arrivalCity",
                  },
                },
                arrivalAirport: {
                  code: {
                    ola: "ArrivalAirport.attributes.Iata",
                    plum: "arrivalCity",
                  },
                  name: {
                    ola: "ArrivalAirport.$value",
                    plum: "arrivalCity",
                  },
                },
              },
            },
            stopovers: {
              plum: "segments.stopovers",
              ola: "Stops",
            },
          },
        },
        date: {
          plum: "departureFrom",
          ola: "Flight.Trips.Trip.[0].DepartureDate",
        },
        seats: {
          plum: "departureSeats",
          ola: "departureSeats",
        },
      },
    },
  },
  /**
   * Maps the response data according to the provider's configuration
   * @param {Array} response - The response data to map
   * @param {string} provider - The provider identifier
   * @param {string} consumer - The consumer type ("detail" or other)
   * @returns {Array} The mapped response data
   */
  mapper: (response, provider, consumer) => {
    if (!response || !Array.isArray(response) || response.length === 0)
      return response;

    const respConfig =
      consumer === "detail"
        ? ProviderService.detailResponseConfig
        : ProviderService.availResponseConfig;

    return response.map((pkg) => {
      const mappedPkg = mapNestedObject(
        pkg,
        respConfig,
        provider,
        getByDotOperator,
        hasNestedProperty
      );
      mappedPkg.provider = provider;
      return mappedPkg;
    });
  },

  /**
   * Fetches package availability based on search parameters
   * @async
   * @param {Object} searchParams - The search parameters
   * @param {Object} selectedFilters - Filters to apply
   * @returns {Promise<Object>} The package availability data
   * @throws {Error} If the fetch request fails
   */
  getPkgAvailabilityAndFilters: async (searchParams, selectedFilters) => {
    try {
      const pkgAvailabilityRequest = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/packages/availability`,
        {
          method: "POST",
          body: JSON.stringify({ searchParams, selectedFilters }),
          headers: ApiUtils.getCommonHeaders(),
        }
      );

      if (!pkgAvailabilityRequest.ok) {
        const response = await pkgAvailabilityRequest.json();
        throw new Error(
          `Ocurrió un error en el avail de paquetes. Razón: ${response.reason || "Desconocida"}`
        );
      }

      return pkgAvailabilityRequest.json();
    } catch (error) {
      throw new Error(`Error en disponibilidad: ${error.message}`);
    }
  },

  /**
   * Fetches package detail based on provider and id
   * @async
   * @param {Object} params - Parameters for fetching package details
   * @returns {Promise<Object>} The package detail data
   */
  getPkgDetail: async ({
    provider,
    id,
    arrivalCity,
    departureCity,
    startDate,
    endDate,
    priceId,
    occupancy,
    departureId,
  }) => {
    try {
      const pkgDetailRequest = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/packages/detail`,
        {
          method: "POST",
          body: JSON.stringify({
            provider,
            id,
            arrivalCity,
            departureCity,
            startDate,
            endDate,
            priceId,
            occupancy,
            departureId,
          }),
          headers: ApiUtils.getCommonHeaders(),
        }
      );

      if (!pkgDetailRequest.ok) {
        const response = await pkgDetailRequest.json();
        return {
          error: `Ocurrió un error en el detail de paquetes. Razón: ${JSON.stringify(response)}`,
        };
      }

      return pkgDetailRequest.json();
    } catch (error) {
      return {
        error: `Ocurrió un error en el detail de paquetes. Razón: ${error.message}`,
      };
    }
  },

  /**
   * Generates departure date options for the current month and year
   * @param {string} [startDate] - Optional start date in 'YYYY-MM-DD' format
   * @returns {Array<Object>|Object} Array of departure date options or single option
   */
  departureDateMonthYear: (startDate) => {
    const currentDate = startDate ? new Date(startDate) : new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = startDate
      ? parseInt(startDate.split("-")[1]) - 1 // Mes en base 0
      : currentDate.getMonth();

    // Si se proporciona startDate, devolver solo el mes correspondiente
    if (startDate) {
      const monthNumber = currentMonth + 1; // Convertir a base 1
      const monthString = monthNumber.toString().padStart(2, "0");
      const value = `${monthString}-${currentYear}`;

      return {
        id: monthNumber,
        value: value,
        label: `${MONTHS[currentMonth]}, ${currentYear}`,
      };
    }

    const options = [];

    // Agregar meses del año actual
    const currentYearOptions = MONTHS.map((month, index) => {
      const monthNumber = index + 1; // Convertir a base 1
      const monthString = monthNumber.toString().padStart(2, "0");
      const value = `${monthString}-${currentYear}`;

      return {
        id: monthNumber,
        value,
        label: `${month}, ${currentYear}`,
      };
    }).filter((_, index) => index >= currentMonth); // Filtrar para obtener solo los meses restantes

    if (currentYearOptions.length > 0) {
      options.push({
        label: `Este año ${currentYear}`,
        options: currentYearOptions,
      });
    }

    // Agregar meses del próximo año
    const nextYearOptions = MONTHS.map((month, index) => {
      const monthNumber = index + 1; // Convertir a base 1
      const monthString = monthNumber.toString().padStart(2, "0");
      const value = `${monthString}-${currentYear + 1}`;

      return {
        id: monthNumber + 12, // Asegurar IDs únicos para el próximo año
        value,
        label: `${month}, ${currentYear + 1}`,
      };
    });

    if (nextYearOptions.length > 0) {
      options.push({
        label: `Próximo año ${currentYear + 1}`,
        options: nextYearOptions,
      });
    }

    return options;
  },

  /**
   * Generates start and end dates for a given month and year
   * @param {string} monthYear - Month and year in 'MM-YYYY' format
   * @returns {Object|null} Object with startDate and endDate, or null if invalid input
   */
  departureDateFromTo: (monthYear) => {
    if (!monthYear) return null;

    const [month, year] = monthYear.split("-");
    const today = new Date();
    const currentMonthLastDay = new Date(year, month, 0).getDate();

    // Verificar si el mes y año proporcionados coinciden con el mes y año actual
    const isCurrentMonth =
      today.getMonth() + 1 === parseInt(month) &&
      today.getFullYear() === parseInt(year);
    const startDay = isCurrentMonth ? today.getDate() : 1;

    return {
      startDate: `${year}-${month}-${String(startDay).padStart(2, "0")}`,
      endDate: `${year}-${month}-${currentMonthLastDay}`,
    };
  },

  // Reuse the utility functions
  hasNestedProperty,
  getByDotOperator,

  /**
   * Gets default values for search engine
   * @param {string} startDate - Start date
   * @param {string} arrivalCity - Arrival city code
   * @param {string} departureCity - Departure city code
   * @returns {Promise<Object>} Default values
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
        departureMonthYear: ProviderService.departureDateMonthYear(startDate),
        arrivalCity: arrivalCityData,
        departureCity: departureCityData,
      },
    };
  },

  /**
   * Parses room configuration string
   * @param {string} configString - Room configuration string
   * @returns {Array<Object>} Array of room configurations
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

  julia: {},

  ola: {
    /**
     * Converts a date from DD-MM-YYYY format to YYYY-MM-DD format
     * @param {string} dayMonthYear - Date in DD-MM-YYYY format
     * @returns {string} Date in YYYY-MM-DD format
     */
    olaDateFormat: (dayMonthYear) => {
      if (!dayMonthYear) return "";
      const [day, month, year] = dayMonthYear.split("-");
      return `${year}-${month}-${day}`;
    },

    /**
     * Groups response by unique keys to remove duplicates
     * @param {Array} mappedResponse - Array of response objects
     * @param {string} criteria - Grouping criteria
     * @returns {Array} Deduplicated array
     */
    grouper: (mappedResponse, criteria = null) => {
      if (!mappedResponse || !Array.isArray(mappedResponse)) return [];

      const uniqueResponse = [];
      const seenItems = new Set();

      mappedResponse.forEach((item) => {
        if (!item) return;

        let uniqueKey;
        if (criteria) {
          uniqueKey = `${item[criteria]}`;
        } else if (item.departures?.[0]?.hotels?.[0]) {
          const hotel = item.departures[0].hotels[0];
          uniqueKey = `${item.id}-${hotel.name}-${hotel.roomType}-${hotel.roomSize}-${hotel.mealPlan}`;
        } else {
          uniqueKey = `${item.id}-${Date.now()}-${Math.random()}`;
        }

        if (!seenItems.has(uniqueKey)) {
          seenItems.add(uniqueKey);
          uniqueResponse.push(item);
        }
      });

      return uniqueResponse;
    },

    /**
     * Generates XML for room configuration
     * @param {Array} roomsConfig - Room configuration array
     * @returns {string} XML string
     */
    generateXMLRoomsByConfigString: (roomsConfig) => {
      if (!roomsConfig || !Array.isArray(roomsConfig)) return "<Rooms></Rooms>";

      const roomStrings = roomsConfig.map((room) => {
        if (!room) return "";

        const adultStrings = Array(room.adults || 0)
          .fill('    <Passenger Type="ADL"/>')
          .join("\n");

        const childStrings = (room.children || [])
          .map((age) => `    <Passenger Type="CHD" Age="${age}"/>`)
          .join("\n");

        return `  <Room>\n${adultStrings}${adultStrings && childStrings ? "\n" : ""}${childStrings}\n  </Room>`;
      });

      return `<Rooms>\n${roomStrings.join("\n")}\n</Rooms>`;
    },
  },

  /**
   * Helper for fetch with json response
   * @param  {...any} args - Fetch arguments
   * @returns {Promise<any>} JSON response
   */
  clientFetch: (...args) => fetch(...args).then((res) => res.json()),
};
