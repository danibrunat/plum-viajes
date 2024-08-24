import soap from "soap";
import { isObject } from "../../helpers/validation";

const XmlService = {
  buildXmlSet: (object) => {
    const builder = require("xml2js").Builder();
    const xmlSet = builder.buildObject(object);

    return xmlSet;
  },
  parseXmlResults: (xml, rootElement = "DocumentElement") => {
    const parseString = require("xml2js").parseString;
    let results = [];
    if (Array.isArray(xml)) return xml;
    parseString(xml, function (err, result) {
      console.log("result", result);
      const emptyResponse = XmlService.isEmptyString(result[rootElement]);
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
  parseSoapResults: (soap) => {
    const parseString = require("xml2js").parseString;
    let results = [];
    if (Array.isArray(soap)) return soap;
    parseString(soap, function (err, result) {
      console.log("result", result);
      const emptyResponse = XmlService.isEmptyString(result);
      // console.log("emptyResponse", emptyResponse);
      if (emptyResponse) return [];

      const rawResults =
        result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][0][
          "ns1:GetPackagesFaresResponse"
        ][0]["Response"];
      console.log("rawResults", rawResults);
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
  soap: {
    request: async (url, pBaseRequest, service) => {
      const request = {
        Request: {
          attributes: {
            "xsi:type": "xsd:string",
          },
          $xml: `<![CDATA[
              ${pBaseRequest}
            ]]>`,
        },
      };

      try {
        const client = await soap.createClientAsync(url + "?wsdl", {
          endpoint: url,
        });
        const soapRequest = await client.GetPackagesFaresAsync(request);
        const soapValue = soapRequest[0].Response["$value"];
        const object = client.wsdl.xmlToObject(soapValue);
        const olaResponse = object["GetPackagesFaresResponse"];
        // console.log("object", JSON.stringify(object));
        if (olaResponse["Messages"] || !olaResponse.PackageFare) return [];
        // console.log olaResponse["Messages"].Message.Text;
        const packageFare = Array.isArray(olaResponse.PackageFare)
          ? olaResponse.PackageFare
          : [olaResponse.PackageFare];
        const response = packageFare;
        return response;
      } catch (error) {
        console.error("error al llamar a OLA", error);
      }
    },
  },
};

export default XmlService;
