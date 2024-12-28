import axios from "axios";
import { parseStringPromise } from "xml2js"; // Para parsear el XML

// Función general para simplificar arrays de un solo elemento, mapear "_" a "$value" y cambiar "$" a "attributes"
const simplifyAndMapValues = (data) => {
  if (Array.isArray(data)) {
    // Si es un array, procesar cada elemento
    return data.map((item) => simplifyAndMapValues(item));
  } else if (typeof data === "object" && data !== null) {
    Object.keys(data).forEach((key) => {
      // Si existe la propiedad "_", mapearla a "$value"
      if (data[key] && data[key]._ !== undefined) {
        data[key].$value = data[key]._; // Asignar el valor de _ a $value
        delete data[key]._; // Eliminar la propiedad "_"
      }

      // Si el valor es un array de un solo elemento, simplificarlo
      if (Array.isArray(data[key]) && data[key].length === 1) {
        data[key] = data[key][0];
      }

      // Renombrar "$" a "attributes"
      if (key === "$") {
        data.attributes = data[key];
        delete data[key];
      }

      // Renombrar "$" a "attributes"
      if (key === "_") {
        data.$value = data[key];
        delete data[key];
      }

      // Llamada recursiva para procesar las subpropiedades
      data[key] = simplifyAndMapValues(data[key]);
    });
  }
  return data;
};

const XmlService = {
  buildXmlSet: (object) => {
    const builder = require("xml2js").Builder();
    const xmlSet = builder.buildObject(object);
    return xmlSet;
  },
  /*  parseXmlResults: async (xml, rootElement = "DocumentElement") => {
    try {
      const result = await parseStringPromise(xml, { explicitArray: false }); // Ajuste para evitar arrays innecesarios
      const emptyResponse = XmlService.isEmptyString(result[rootElement]);
      if (emptyResponse) return [];

      // Recorrer las propiedades del resultado
      const rawResults = result.DocumentElement?.Row;
      if (rawResults && Array.isArray(rawResults)) {
        return rawResults.map((resultItem) => {
          Object.keys(resultItem).forEach((resultProperty) => {
            resultItem[resultProperty] = resultItem[resultProperty][0];
          });
          return resultItem;
        });
      }
      return [];
    } catch (error) {
      console.error("Error al parsear el XML:", error);
      return [];
    }
  }, */
  isEmptyString: (string) => {
    return string === "" ? true : false;
  },
  soap: {
    request: async (url, pBaseRequest, service) => {
      const soapEnvelope = `<?xml version="1.0" encoding="ISO-8859-1"?>
      <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
                         xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                         xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
                         xmlns:tns="http://aws-qa1.ola.com.ar/qa/wsola/endpoint"
                         SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <SOAP-ENV:Body>
          <tns:GetPackagesFares xmlns:tns="http://aws-qa1.ola.com.ar/qa/wsola/endpoint">
            <Request xsi:type="xsd:string"><![CDATA[
             ${pBaseRequest}
            ]]></Request>
          </tns:GetPackagesFares>
        </SOAP-ENV:Body>
      </SOAP-ENV:Envelope>`;

      try {
        const response = await fetch(url, {
          body: soapEnvelope,
          method: "POST",
          next: {
            revalidate: 10000,
          },
          headers: {
            "Content-Type": "text/xml",
            SOAPAction: `"${service}"`,
          },
        });

        const responseJson = await response.text();

        // Parsear la respuesta XML
        const soapResponse = await parseStringPromise(responseJson, {
          explicitArray: false,
        });
        const envelope = soapResponse["SOAP-ENV:Envelope"];
        const body = envelope["SOAP-ENV:Body"];
        const serviceResponse = body[`ns1:${service}Response`];

        if (
          !serviceResponse ||
          !serviceResponse.Response ||
          !serviceResponse.Response._
        ) {
          return [];
        }

        // Volver a parsear el contenido de Response._
        const nestedXml = serviceResponse.Response._;
        const parsedNestedXml = await parseStringPromise(nestedXml, {
          explicitArray: false,
        });

        // Simplificar arrays de un solo elemento
        const simplifiedData = simplifyAndMapValues(
          parsedNestedXml.GetPackagesFaresResponse?.PackageFare
        );

        return simplifiedData ? simplifiedData : [];
      } catch (error) {
        console.error("Error al llamar a OLA", error);
        throw error;
      }
    },
  },
};

export default XmlService;
