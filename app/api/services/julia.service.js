import { ProviderService } from "./providers";
import Dates from "../../services/dates.service";
import XmlService from "./xml.service";
import { ApiUtils } from "./apiUtils.service";

const getHeaderRequest = (token) => {
  return {
    Token: token,
    Origen: "B", // Buenos Aires
    DestinoIZPais: "MX", // Brasil
    DestinoIZCiudad: "CUN",
    Ocupacion: "2", // 2 adultos
    VigenciaDesde: "2025-11-01",
    VigenciaHasta: "2025-11-30",
    IDPaquete: 0, // Debemos poner 0 para que traiga todos. Sino va a traer un ID de paquete específico.
    Nombre: "",
    OrdenadoPor: "1",
    AscDes: "A",
  };
};

const getDeparturesRequest = (token, { IDPAQUETE }, searchParams) => {
  //console.log("getDeparturesRequest | IDPAQUETE", IDPAQUETE);
  return {
    Token: token,
    IDPaquete: IDPAQUETE,
    FechaDesde: searchParams.departureFrom,
    FechaHasta: searchParams.departureTo,
    Ocupacion: searchParams.occupancy,
  };
};

export const Julia = {
  /**
   * @function login Logueo del servicio de Julia Tours
   * @returns token
   */
  getToken: async () => {
    const loginService = `http://ycixweb.juliatours.com.ar/WSJULIADEMO/WSJULIA.asmx/WS_jw_LOGIN`;

    const juliaLoginRequest = await fetch(
      `${loginService}?LOGIN=PLUM_TEST&PASSWORD=t6yyCNtlTuTu&IDAGENCIA=14710`,
      { method: "GET", headers: ApiUtils.getCommonHeaders() }
    );
    const juliaTokenResponse = await juliaLoginRequest.text();
    const parsedToken = await XmlService.parseXmlResults(juliaTokenResponse);
    const token = parsedToken[0]["IDTOKEN"];
    return token;
  },
  /**
   *
   * @param {{}} requestData
   * @function pkgHeader Julia header avail
   */
  pkgHeader: async (requestData) => {
    try {
      const juliaHeaderUrl = `http://ycixweb.juliatours.com.ar/WSJULIADEMO/WSJULIA.asmx/WS_jw_PAQUETES_CABECERA`;
      const juliaPkgHeaderAvail = await fetch(juliaHeaderUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...ApiUtils.getCommonHeaders(),
        },
        body: new URLSearchParams({ ...requestData }),
      });

      const juliaPkgHeaderAvailXml = await juliaPkgHeaderAvail.text();
      const juliaPkgAvailHeaderResponse = await XmlService.parseXmlResults(
        juliaPkgHeaderAvailXml
      );
      console.log("juliaPkgAvailHeaderResponse", juliaPkgAvailHeaderResponse);
      return juliaPkgAvailHeaderResponse;
    } catch (error) {
      console.error("pkgHeader error -> ", error);
      return error;
    }
  },
  /**
   *
   * @param {{}} pkgDeparturesHeader
   * @function  pkgDepartureHotelsGroup header avail
   */

  pkgDepartureHotelsGroup: async (sessionToken, departure, searchParams) => {
    const departureHotelsGroupUrl = `http://ycixweb.juliatours.com.ar/WSJULIADEMO/WSJULIA.asmx/WS_jw_PAQUETES_GRUPO_HOTELES`;
    let hotelsGroupResponse = [];
    try {
      const departureHotelsGroupOptions = {
        Token: sessionToken,
        IDPaquete: Number(departure.IDPAQUETE),
        Ocupacion: Number(searchParams.occupancy),
        NroGrupo: 0,
        FechaInicio1: Dates.get(departure.FECHADESDE).toFormat("YYYY-MM-DD"),
        FechaInicio2: Dates.get("2000-01-01").toFormat("YYYY-MM-DD"),
        FechaInicio3: Dates.get("2000-01-01").toFormat("YYYY-MM-DD"),
        FechaInicio4: Dates.get("2000-01-01").toFormat("YYYY-MM-DD"),
        FechaInicio5: Dates.get("2000-01-01").toFormat("YYYY-MM-DD"),
      };

      // console.log("departureHotelsGroupOptions", departureHotelsGroupOptions);
      const departureHotelsGroupRequest = await fetch(departureHotelsGroupUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...ApiUtils.getCommonHeaders(),
        },
        body: new URLSearchParams({ ...departureHotelsGroupOptions }),
      });
      // console.log("departureHotelsGroupRequest", departureHotelsGroupRequest);
      if (departureHotelsGroupRequest.ok) {
        const departureHotelsGroup = await departureHotelsGroupRequest.text();

        hotelsGroupResponse = XmlService.parseXmlResults(departureHotelsGroup);
      }
      return hotelsGroupResponse;
    } catch (error) {
      console.log("pkgDepartureHotelsGroup | error -> ", error);
      return error;
    }
  },
  pkgDepartureFlights: async (sessionToken, departure) => {
    const departureFlightsUrl = `http://ycixweb.juliatours.com.ar/WSJULIADEMO/WSJULIA.asmx/WS_jw_PAQUETES_SALIDAS_VUELOS`;
    let flightsResponse = [];
    try {
      const departureFlightsOptions = {
        Token: sessionToken,
        IDPaquete: departure.IDPAQUETE,
        FechaDesde: departure.FECHADESDE,
      };

      const departureFlightsRequest = await fetch(departureFlightsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...ApiUtils.getCommonHeaders(),
        },
        body: new URLSearchParams({ ...departureFlightsOptions }),
      });
      if (departureFlightsRequest.ok) {
        const departureFlights = await departureFlightsRequest.text();
        flightsResponse = XmlService.parseXmlResults(departureFlights);
      }
      return flightsResponse;
    } catch (error) {
      return error;
    }
  },
  pkgDeparturePrices: async (sessionToken, departure, searchParams) => {
    const departurePricesUrl = `http://ycixweb.juliatours.com.ar/WSJULIADEMO/WSJULIA.asmx/WS_jw_PAQUETES_GRUPO_PRECIOS`;
    let pricesResponse = [];
    try {
      const departurePricesOptions = {
        Token: sessionToken,
        IDPaquete: Number(departure.IDPAQUETE),
        Ocupacion: Number(searchParams.occupancy),
        FechaInicio: Dates.get(departure.FECHADESDE).toFormat("YYYY-MM-DD"),
        NroGrupo: 0,
      };

      const departurePricesRequest = await fetch(departurePricesUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...ApiUtils.getCommonHeaders(),
        },
        body: new URLSearchParams({ ...departurePricesOptions }),
      });

      if (departurePricesRequest.ok) {
        const departurePrices = await departurePricesRequest.text();

        //console.log("departurePrices", departurePrices);
        pricesResponse = XmlService.parseXmlResults(departurePrices);
      }
      return pricesResponse;
    } catch (error) {
      console.log("prices error -> ", error);
      return error;
    }
  },
  /**
   *
   * @param {{}} pkgDeparturesHeader
   * @function  pkgDepartureFlights header avail
   */
  pkgDepartureData: async (pkgDeparturesHeader, sessionToken, searchParams) => {
    try {
      const departureData = await Promise.all(
        pkgDeparturesHeader.map(async (departure) => {
          const [departureFlights, departureHotelsGroup, departurePrices] =
            await Promise.all([
              Julia.pkgDepartureFlights(sessionToken, departure),
              Julia.pkgDepartureHotelsGroup(
                sessionToken,
                departure,
                searchParams
              ),
              Julia.pkgDeparturePrices(sessionToken, departure, searchParams),
            ]);

          departure.flights = departureFlights;
          departure.hotelsGroup = departureHotelsGroup;
          departure.prices = departurePrices;
          //console.log("final departure -> ", departure);
          return departure;

          //console.log("departureWithFlights", departureWithFlights);
        })
      );
      //console.log("departureData", departureData);
      return departureData;
    } catch (error) {
      console.log("pkgDepartureData error", error);
      return error;
    }
  },
  /**
   *
   * @param {{}} requestData
   * @function  pkgDepartures header avail
   */

  pkgDepartures: async (requestData, sessionToken, searchParams) => {
    try {
      let pkgDeparturesResponse = [];
      // console.log("pkgDepartures | requestData", requestData);
      const departuresUrl = `http://ycixweb.juliatours.com.ar/WSJULIADEMO/WSJULIA.asmx/WS_jw_PAQUETES_SALIDAS`;
      const pkgDeparturesRequest = await fetch(departuresUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...ApiUtils.getCommonHeaders(),
        },
        body: new URLSearchParams({ ...requestData }),
      });
      const pkgDepartures = await pkgDeparturesRequest.text();
      const pkgDeparturesHeader =
        await XmlService.parseXmlResults(pkgDepartures);

      if (pkgDeparturesHeader && pkgDeparturesHeader.length > 0) {
        // console.log("pkgDeparturesHeader", pkgDeparturesHeader);
        const pkgDepartureDetail = await Julia.pkgDepartureData(
          pkgDeparturesHeader,
          sessionToken,
          searchParams
        );
        pkgDeparturesResponse = pkgDepartureDetail;
        //console.log("pkgDeparturesResponse", pkgDeparturesResponse);
      }
      return pkgDeparturesResponse;
    } catch (error) {
      console.error("Julia | pkgDepartures error -> ", error);
      return error;
    }
  },
  /**
   * @func pkgAvail Búsqueda de Paquetes
   */
  pkgAvail: async (searchParams) => {
    try {
      let pkgResponse = [];
      // Token
      const token = await Julia.getToken();
      // Header
      const headerRequest = getHeaderRequest(token);
      const headerResults = await Julia.pkgHeader(headerRequest);
      if (headerResults && headerResults.length === 0) return { pkgResponse };

      // Departures + Flights / Hotels: Add departures, flights and hotels for each pkg.
      const departuresData = await Promise.all(
        headerResults.map(async (pkg) => {
          pkg.departures = [];
          const departuresRequest = getDeparturesRequest(
            token,
            pkg,
            searchParams
          );
          const departures = await Julia.pkgDepartures(
            departuresRequest,
            token,
            searchParams
          );

          if (!departures || departures.length === 0) return false;
          pkg.departures = departures;
          return pkg;
        })
      );

      //console.log("headerResults", headerResults);

      // Clean empty departures. Don't show on availability list.
      const pkgWithDepartures = departuresData.filter(
        (pkg) => pkg.departures.length > 0
      );
      console.log("pkgWithDepartures", JSON.stringify(pkgWithDepartures));

      return pkgWithDepartures;
    } catch (error) {
      console.error("error -> ", error);
      return new Error("Error al traer el avail Julia", error);
    }
  },
};
