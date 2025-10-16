import { parseStringPromise } from "xml2js"; // Para parsear el XML

class XmlService {
  constructor() {
    this.soap = {
      request: this.#soapRequest.bind(this),
    };
  }

  buildXmlSet(object) {
    const builder = require("xml2js").Builder();
    return builder.buildObject(object);
  }

  async parseXmlResults(xml, rootElement = "DocumentElement") {
    try {
      const parsedXml = await parseStringPromise(xml, {
        explicitArray: false,
        trim: true,
      });

      const rootNode = rootElement ? parsedXml?.[rootElement] : parsedXml;
      if (!rootNode || this.#isEmptyString(rootNode)) {
        return [];
      }

      let rowsSource = rootNode?.Row ?? rootNode?.row;
      if (!rowsSource) {
        if (Array.isArray(rootNode)) {
          rowsSource = rootNode;
        } else if (typeof rootNode === "object") {
          rowsSource = rootNode;
        }
      }

      if (!rowsSource) {
        return [];
      }

      const rows = Array.isArray(rowsSource) ? rowsSource : [rowsSource];

      return rows.reduce((acc, item) => {
        if (!item || typeof item !== "object") {
          return acc;
        }

        acc.push(this.#normalizeRowItem(item));
        return acc;
      }, []);
    } catch (error) {
      console.error("Error al parsear el XML:", error);
      return [];
    }
  }

  #normalizeRowItem(item) {
    return Object.entries(item).reduce((normalized, [key, value]) => {
      if (Array.isArray(value)) {
        normalized[key] = value.length === 1 ? value[0] : value;
      } else if (value && typeof value === "object" && "$value" in value) {
        normalized[key] = value.$value;
      } else {
        normalized[key] = value;
      }
      return normalized;
    }, {});
  }

  #isEmptyString(value) {
    return value === "";
  }

  async #soapRequest(url, pBaseRequest, service) {
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
          revalidate: 0,
        },
        headers: {
          "Content-Type": "text/xml",
          SOAPAction: `"${service}"`,
        },
      });

      const responseJson = await response.text();

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

      const nestedXml = serviceResponse.Response._;
      const parsedNestedXml = await parseStringPromise(nestedXml, {
        explicitArray: false,
      });

      const simplifiedData = this.#simplifyAndMapValues(
        parsedNestedXml.GetPackagesFaresResponse?.PackageFare
      );

      return simplifiedData ? simplifiedData : [];
    } catch (error) {
      console.error("Error al llamar a OLA", error);
      throw error;
    }
  }

  #simplifyAndMapValues(data) {
    if (Array.isArray(data)) {
      return data.map((item) => this.#simplifyAndMapValues(item));
    }

    if (data && typeof data === "object") {
      Object.keys(data).forEach((key) => {
        if (data[key] && data[key]._ !== undefined) {
          data[key].$value = data[key]._;
          delete data[key]._;
        }

        if (Array.isArray(data[key]) && data[key].length === 1) {
          data[key] = data[key][0];
        }

        if (key === "$") {
          data.attributes = data[key];
          delete data[key];
        }

        if (key === "_") {
          data.$value = data[key];
          delete data[key];
        }

        data[key] = this.#simplifyAndMapValues(data[key]);
      });
    }

    return data;
  }
}

const xmlService = new XmlService();

export default xmlService;
