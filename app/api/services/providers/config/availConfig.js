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
};
