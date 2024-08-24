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
  ola: {},
};
