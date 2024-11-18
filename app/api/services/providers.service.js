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
      isArray: true,
      items: {
        id: {
          plum: "departures.[].hotels.[0].id",
          julia: "hotels",
          ola: "Descriptions.Description.Name",
        },
        name: {
          plum: "departures.[].hotels.[0].name",
          julia: "hotels",
          ola: "Descriptions.Description.Name",
        },
        rating: {
          plum: "departures.[].hotels.[0].rating",
          julia: "rating",
          ola: "Descriptions.Description.HotelClass",
        },
        mealPlan: {
          plum: "departures.[].mealPlan",
          julia: "hotels",
          ola: "Descriptions.Description.FareDescriptions.FareDescription.[1].$value",
        },
        roomType: {
          plum: "departures.[].roomType",
          julia: "hotels",
          ola: "Descriptions.Description.FareDescriptions.FareDescription.[0].$value",
        },
        roomSize: {
          plum: "departures.[].roomSize",
          julia: "hotels",
          ola: "Descriptions.Description.FareDescriptions.FareDescription.[2].$value",
        },
      },
    },
    thumbnails: {
      plum: "images",
      ola: "Package.Pictures.Picture.[].$value",
    },
    prices: {
      id: {
        plum: "1234",
        ola: "FareCodes.FareOption",
      },
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
      date: {
        plum: "departures",
        ola: "Flight.Trips.Trip.[0].DepartureDate",
      },
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
      isArray: true,
      items: {
        id: {
          plum: "departures.[].hotels.[0].id",
          julia: "hotels",
          ola: "Descriptions.Description.Name",
        },
        name: {
          plum: "departures.[].hotels.[0].name",
          julia: "hotels",
          ola: "Descriptions.Description.Name",
        },
        rating: {
          plum: "departures.[].hotels.[0].rating",
          julia: "rating",
          ola: "Descriptions.Description.HotelClass",
        },
        mealPlan: {
          plum: "departures.[].mealPlan",
          julia: "hotels",
          ola: "Descriptions.Description.FareDescriptions.FareDescription.[1].$value",
        },
        roomType: {
          plum: "departures.[].roomType",
          julia: "hotels",
          ola: "Descriptions.Description.FareDescriptions.FareDescription.[0].$value",
        },
        roomSize: {
          plum: "departures.[].roomSize",
          julia: "hotels",
          ola: "Descriptions.Description.FareDescriptions.FareDescription.[2].$value",
        },
      },
    },
    images: {
      plum: "images",
      ola: "Package.Pictures.Picture.[].$value",
    },
    prices: {
      id: {
        plum: "1234",
        ola: "FareCodes.FareOption",
      },
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
      date: {
        plum: "departures.[].departureFrom",
        ola: "Flight.Trips.Trip.[0].DepartureDate",
      },
    },
  },

  /**
   * Fetches package availability based on search parameters
   * @async
   * @param {Object} searchParams - The search parameters
   * @returns {Promise<Object>} The package availability data
   * @throws {Error} If the fetch request fails
   */
  getPkgAvailabilityAndFilters: async (searchParams) => {
    const pkgAvailabilityRequest = await fetch(
      `${process.env.URL}/api/packages/availability`,
      {
        method: "POST",
        body: JSON.stringify({ searchParams }),
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
  getPkgDetail: async ({
    provider,
    id,
    arrivalCity,
    departureCity,
    startDate,
    endDate,
    priceId,
    rooms,
  }) => {
    const pkgDetailRequest = await fetch(
      `${process.env.URL}/api/packages/detail`,
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
          rooms,
        }),
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
      startDate: `${year}-${month}-01`,
      endDate: `${year}-${month}-${currentMonthLastDay}`,
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
  getByDotOperator: (object, value) => {
    if (!object || !value) return null;

    const reduced = value.split(".").reduce((acc, curr) => {
      // Si encontramos un índice como "[0]", accedemos a la posición correspondiente
      if (/^\[\d+\]$/.test(curr)) {
        const index = parseInt(curr.slice(1, -1), 10); // Extraemos el índice
        return Array.isArray(acc) ? acc[index] : undefined;
      }
      // Si encontramos "[]", recorremos el array y devolvemos un array de los valores resultantes
      else if (curr === "[]") {
        if (Array.isArray(acc)) {
          return acc.map((item) => item); // Mantenemos todos los elementos del array
        } else {
          return []; // Si no es un array, devolvemos un array vacío
        }
      }
      // Si acc es un array, mapeamos la propiedad a todos los elementos
      else if (Array.isArray(acc)) {
        return acc.map((item) => (item ? item[curr] : undefined));
      }
      // Si acc no es un array, simplemente accedemos a la propiedad del objeto
      else {
        return acc ? acc[curr] : undefined;
      }
    }, object);

    // Si el resultado es un array con un solo valor, devolvemos ese valor en lugar de un array
    if (Array.isArray(reduced) && reduced.length === 1) {
      return reduced[0];
    }

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

    // Función para verificar si es un objeto
    const isObject = (value) => value !== null && typeof value === "object";
    const mapNestedObject = (pkg, configObj) => {
      let result = {};

      Object.entries(configObj).forEach(([key, value]) => {
        // Si la configuración es un array, lo manejamos inmediatamente
        if (value.isArray) {
          result[key] = [mapNestedObject(pkg, value.items)];
          return;
        }

        // Verificamos si 'value' es un objeto anidado pero no contiene el proveedor directamente
        if (isObject(value) && !value[provider]) {
          // Recursivamente mapeamos este objeto
          result[key] = mapNestedObject(pkg, value);
          return;
        }

        // Si no es un objeto o no tiene el proveedor en la configuración, no hacemos nada
        if (!isObject(value) || !value[provider]) {
          console.warn(`Unexpected value type for key ${key}:`, value);
          return;
        }

        const providerConfigProp = value[provider];
        result[key] = ProviderService.hasNestedProperty(providerConfigProp)
          ? ProviderService.getByDotOperator(pkg, providerConfigProp)
          : pkg[providerConfigProp];
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
  getRoomsConfig: (configString) => {
    // Si el string está vacío o indefinido, retornar un array vacío
    if (!configString || configString.trim() === "") return [];

    // Dividimos las habitaciones usando la coma ","
    const rooms = configString.split(",");

    // Recorremos cada habitación para procesar adultos y niños
    return rooms.map((room) => {
      // Dividimos adultos de niños usando "|"
      const [adultsPart, childrenPart] = room.split("|");

      // Convertimos la cantidad de adultos en número
      const adults = parseInt(adultsPart, 10) || 0;

      // Procesamos las edades de los niños si existen, si no, devolvemos un array vacío
      const children = childrenPart ? childrenPart.split("-").map(Number) : [];

      // Devolvemos un objeto con adultos y niños para cada habitación
      return {
        adults,
        children,
      };
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
        const uniqueKey = `${item.id}-${item.hotels[0].name}-${item.hotels[0].roomType}-${item.hotels[0].roomSize}-${item.hotels[0].mealPlan}`;
        if (!seenItems.has(uniqueKey)) {
          seenItems.add(uniqueKey);
          uniqueResponse.push(item);
        }
      });

      return uniqueResponse;
    },

    // Helper para generar el XML
    generateXMLRoomsByConfigString: (roomsConfig) => {
      let xmlString = "<Rooms>\n";

      roomsConfig.forEach((room) => {
        xmlString += "  <Room>\n";

        // Agregar tantos adultos (Passenger Type="ADL") como indique el objeto
        for (let i = 0; i < room.adults; i++) {
          xmlString += '    <Passenger Type="ADL"/>\n';
        }

        // Agregar tantos niños (Passenger Type="CHD") con la propiedad age como niños haya
        room.children.forEach((age) => {
          xmlString += `    <Passenger Type="CHD" Age="${age}"/>\n`;
        });

        xmlString += "  </Room>\n";
      });

      xmlString += "</Rooms>";
      return xmlString;
    },
  },
  clientFetch: (...args) => fetch(...args).then((res) => res.json()),
};
