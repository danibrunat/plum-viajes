const PROVIDERS = [
  {
    id: "julia",
    label: "Julia Tours",
    active: 1,
    policies: {
      //  availChunkQty: 7,
    },
  },
  { id: "plum", label: "Plum Viajes", active: 1 },
];

export const PlumViajesService = {
  aFunction: () => {},
};

export const ProviderService = {
  availResponseConfig: {
    id: {
      plum: "_id",
      julia: "IDPAQUETE",
    },
    title: {
      plum: "title",
      julia: "NOMBRE",
    },
    subtitle: {
      plum: "subtitle",
      julia: "subtitle",
    },
    nights: {
      plum: "nights",
      julia: "CANTNOCHES",
    },
    hotels: {
      plum: "hotels",
      julia: "hotels",
    },
    departures: {
      plum: "departures",
      julia: "departures",
    },
  },
  mapper: (response, provider) => {
    if (response.length === 0) return response;
    if (provider === "plum") return response;

    const respConfig = ProviderService.availResponseConfig;
    //console.log("response before foreach", response);
    const mappedResponse = response.map((pkg) => {
      let mappedPkg = {};
      Object.keys(respConfig).forEach((prop) => {
        // console.log("[respConfig[prop]", respConfig[prop]);
        mappedPkg[prop] = pkg[respConfig[prop][provider]];
      });
      //console.log("mappedPkg", JSON.stringify(mappedPkg));
      return mappedPkg;
    });
    // console.log("mappedResponse", mappedResponse);
    return mappedResponse;
  },
  julia: {
    parseXmlResults: (xml) => {
      const parseString = require("xml2js").parseString;
      let results = [];
      if (Array.isArray(xml)) return xml;
      parseString(xml, function (err, result) {
        const emptyResponse = ProviderService.julia.isEmptyString(
          result.DocumentElement
        );
        // console.log("emptyResponse", emptyResponse);
        if (emptyResponse) return [];

        const rawResults = result.DocumentElement.Row;
        if (rawResults && Array.isArray(rawResults)) {
          rawResults.map((resultItem) => {
            Object.keys(resultItem).map((resultProperty) => {
              resultItem[resultProperty] = resultItem[resultProperty][0];
            });
          });
          results.push(rawResults);
        }
        if (result.error) return result.error;
      });
      if (results.length === 0) return results;
      const resultArr = results[0];
      return resultArr;
    },
    isEmptyString: (string) => {
      return string === "" ? true : false;
    },
  },
};
