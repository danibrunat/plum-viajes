import { isObject } from "../../helpers/validation";

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

export const PlumViajesService = {
  aFunction: () => {},
};

export const ProviderService = {
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
  departureDateFromTo: (monthYear) => {
    if (!monthYear) return null;
    const [month, year] = monthYear.split("-");
    const currentMonthLastDay = new Date(year, month, 0).getDate();
    return {
      startDate: `01-${month}-${year}`,
      endDate: `${currentMonthLastDay}-${month}-${year}`,
    };
  },
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
      plum: "hotels",
      julia: "hotels",
      ola: "Descriptions.Description.Name",
    },
    thumbnails: {
      plum: "images",
      ola: "Package.Pictures.Picture.[].$value",
    },
    departures: {
      plum: "departures",
      julia: "departures",
    },
  },
  haveNestedProperty: (string) => {
    return string.includes(".");
  },
  /**
   *
   * @param {*} object El objeto a iterar
   * @param {*} value El string de properties a splittear por "."
   * @returns Retorna un objeto según un string de nested properties. Ej: Provider.Code. Buscará dentro de un objeto una propiedad Provider y dentro de ese una propiedad Code y traerá su valor
   */
  getByDotOperator(object, value) {
    if (!object || !value) return null;

    const reduced = value.split(".").reduce((acc, curr) => {
      if (curr === "[]") {
        // Handle array case
        return Array.isArray(acc) ? acc : [];
      } else if (Array.isArray(acc)) {
        // If acc is an array, map the property access to all elements
        return acc.map((item) => item[curr]);
      } else {
        return acc ? acc[curr] : undefined;
      }
    }, object);

    return reduced;
  },
  mapper: (response, provider) => {
    //console.log("mapper | response", response);
    if (response.length === 0) return response;
    if (provider === "plum") return response;
    const respConfig = ProviderService.availResponseConfig;
    //console.log("json.stringify", JSON.stringify(response));

    const mappedResponse = response.map((pkg) => {
      let mappedPkg = {};
      Object.keys(respConfig).forEach((prop) => {
        const providerConfigProp = respConfig[prop][provider];
        if (
          providerConfigProp &&
          ProviderService.haveNestedProperty(providerConfigProp)
        ) {
          mappedPkg[prop] = ProviderService.getByDotOperator(
            pkg,
            providerConfigProp
          );
          return mappedPkg;
        }
        mappedPkg[prop] = pkg[providerConfigProp];
      });
      //console.log("mappedPkg", JSON.stringify(mappedPkg));
      return mappedPkg;
    });
    return mappedResponse;

    //console.log("mappedResponse", mappedResponse);
  },
  julia: {},
  ola: {
    olaDateFormat: (dayMonthYear) => {
      const [day, month, year] = dayMonthYear.split("-");
      return `${year}-${month}-${day}`;
    },
  },
};
