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

import CitiesService from "../../services/cities.service";
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
 * @property {Function} getRoomsConfig
 * @property {Function} getHotelDetailInfo
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
   * @returns {Array} The mapped response data
   */
  mapper: (response, provider, consumer) => {
    if (response.length === 0) return response;

    const respConfig =
      consumer === "detail"
        ? ProviderService.detailResponseConfig
        : ProviderService.availResponseConfig;

    const isObject = (value) => value !== null && typeof value === "object";

    const mapNestedObject = (pkg, configObj, provider) => {
      let result = {};

      Object.entries(configObj).forEach(([key, value]) => {
        if (value.isArray) {
          let arrayData = [];
          // Si está definida la propiedad baseKey para el provider...
          if (value.baseKey && value.baseKey[provider]) {
            const baseKeyValue = value.baseKey[provider].trim();
            // Si se define un valor especial, por ejemplo "@self" (o "continue"),
            // se toma el objeto completo como fuente
            if (baseKeyValue === "@self" || baseKeyValue === "continue") {
              arrayData = pkg;
            } else {
              arrayData =
                ProviderService.getByDotOperator(pkg, baseKeyValue) || [];
            }
          } else {
            // Si no se configuró baseKey, se intenta obtener el array en pkg[key]
            arrayData = pkg[key];
          }

          // Si no se obtuvo un array, se envuelve en uno (si se obtuvo algo) o se asigna []
          if (arrayData === undefined || arrayData === null) {
            arrayData = [];
          } else if (!Array.isArray(arrayData)) {
            arrayData = [arrayData];
          }

          result[key] = arrayData.map((item) =>
            isObject(item) ? mapNestedObject(item, value.items, provider) : item
          );
          return;
        }

        if (isObject(value) && !value[provider]) {
          result[key] = mapNestedObject(pkg, value, provider);
          return;
        }

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

    console.log("response", response);

    const mappedResponse = response.map((pkg) => {
      let mappedPkg = mapNestedObject(pkg, respConfig, provider);
      mappedPkg.provider = provider;
      return mappedPkg;
    });

    return mappedResponse;
  },

  /**
   * Fetches package availability based on search parameters
   * @async
   * @param {Object} searchParams - The search parameters
   * @returns {Promise<Object>} The package availability data
   * @throws {Error} If the fetch request fails
   */
  getPkgAvailabilityAndFilters: async (searchParams, selectedFilters) => {
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
   * @returns {Array<Object>} Array of departure date options
   */
  departureDateMonthYear: (startDate) => {
    const currentDate = startDate ? new Date(startDate) : new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = startDate
      ? parseInt(startDate.split("-")[1]) - 1 // Mes en base 0
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

    const options = [];

    // Si se proporciona startDate, devolver solo el mes correspondiente
    if (startDate) {
      const monthNumber = currentMonth + 1; // Convertir a base 1
      const monthString = monthNumber.toString().padStart(2, "0");
      const value = `${monthString}-${currentYear}`;

      return {
        id: monthNumber,
        value: value,
        label: `${months[currentMonth]}, ${currentYear}`,
      };
    }

    // Agregar meses del año actual
    const currentYearOptions = months
      .map((month, index) => {
        const monthNumber = index + 1; // Convertir a base 1
        const monthString = monthNumber.toString().padStart(2, "0");
        const value = `${monthString}-${currentYear}`;

        return {
          id: monthNumber,
          value,
          label: `${month}, ${currentYear}`,
        };
      })
      .filter((_, index) => index >= currentMonth); // Filtrar para obtener solo los meses restantes

    if (currentYearOptions.length > 0) {
      options.push({
        label: `Este año ${currentYear}`,
        options: currentYearOptions,
      });
    }

    // Agregar meses del próximo año
    const nextYearOptions = months.map((month, index) => {
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
    const today = new Date(); // Obtener la fecha de hoy
    const currentMonthLastDay = new Date(year, month, 0).getDate();

    // Verificar si el mes y año proporcionados coinciden con el mes y año actual
    const startDay =
      today.getMonth() + 1 === parseInt(month) &&
      today.getFullYear() === parseInt(year)
        ? today.getDate() // Si coincide, usamos el día de hoy como inicio
        : 1; // Si no coincide, empezamos desde el primer día del mes

    return {
      startDate: `${year}-${month}-${String(startDay).padStart(2, "0")}`, // Asegurarse que el día tenga 2 dígitos
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
  getByDotOperator: (object, value, isArray = false) => {
    if (!object || !value) return null;

    const reduced = value.split(".").reduce((acc, curr) => {
      // Manejamos arrays de índices "[0]", "[1]", etc.
      if (/^\[\d+\]$/.test(curr)) {
        const index = parseInt(curr.slice(1, -1), 10); // Extraemos el índice
        return Array.isArray(acc) ? acc[index] : undefined;
      }
      // Si encontramos "[]", procesamos según isArray
      else if (curr === "[]") {
        if (Array.isArray(acc) && isArray) {
          return acc.map((item) => item); // Devuelve los elementos si es un array y isArray es true
        } else {
          return Array.isArray(acc) ? acc[0] : acc; // Devuelve solo un valor si no es isArray
        }
      }
      // Si acc es un array, aplicamos map a sus elementos
      else if (Array.isArray(acc)) {
        return acc.map((item) => (item ? item[curr] : undefined));
      }
      // Accedemos a la propiedad del objeto
      else {
        if (value == "amount") {
          console.log("acc", acc);
          console.log("curr", curr);
        }
        return acc ? acc[curr] : undefined;
      }
    }, object);

    // Si el resultado es un array con un solo valor, devolvemos ese valor si isArray no es true
    if (Array.isArray(reduced) && reduced.length === 1 && !isArray) {
      return reduced[0];
    }

    return reduced;
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
    grouper: (mappedResponse, criteria = null) => {
      const uniqueResponse = [];
      const seenItems = new Set();
      mappedResponse.forEach((item) => {
        const uniqueKey = criteria
          ? `${item[criteria]}`
          : `${item.id}-${item.departures[0].hotels[0].name}-${item.departures[0].hotels[0].roomType}-${item.departures[0].hotels[0].roomSize}-${item.departures[0].hotels[0].mealPlan}`;
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
