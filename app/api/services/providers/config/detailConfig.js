export default {
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
          plum: "hotels",
          ola: "Descriptions",
        },
        items: {
          // TODO: Ajustar mealPlan, roomType y roomSize. Analizar si debe ser por hotel.
          id: {
            plum: "_id",
            julia: "hotels",
            ola: "Description.Name",
          },
          name: {
            plum: "name",
            julia: "hotels",
            ola: "Description.Name",
          },
          rating: {
            plum: "stars",
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
};
