import { parseStringPromise } from "xml2js";
import XmlService from "../../../services/xml.service";

const UA_URL = process.env.UA_URL;
const UA_USERNAME = process.env.UA_USERNAME;
const UA_PASSWORD = process.env.UA_PASSWORD;
const UA_ORG = process.env.UA_ORG_EMISORA;
const UA_CONVENIO = process.env.UA_CONVENIO;

const formatDateMMDDYYYY = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  const mm = `${date.getMonth() + 1}`.padStart(2, "0");
  const dd = `${date.getDate()}`.padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

const buildAvailabilityEnvelope = ({
  destination,
  startDate,
  endDate,
  travelers,
  age1,
  paisOrigen,
  tipoViaje,
}) => {
  const fechaInicio = formatDateMMDDYYYY(startDate);
  const fechaFin = formatDateMMDDYYYY(endDate);
  const edad1 = age1 || "30";
  const cantidadPasajeros = travelers || "1";

  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://siebel.com/CustomUI" xmlns:ual="http://www.siebel.com/xml/UALeadCotizadorReq">
  <soapenv:Header>
    <wsse:Security xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/07/secext">
      <wsse:UsernameToken xmlns:wsu="http://schemas.xmlsoap.org/ws/2002/07/utility">
        <wsse:Username>${UA_USERNAME || ""}</wsse:Username>
        <wsse:Password Type="wsse:PasswordText">${UA_PASSWORD || ""}</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
  </soapenv:Header>
  <soapenv:Body>
    <cus:LeadCotizadorOper_Input>
      <ual:UALeadCotizadorReq>
        <ual:DatosLeadCotizadorIn>
          <ual:IdLead></ual:IdLead>
          <ual:OrganizacionEmisora>${UA_ORG || ""}</ual:OrganizacionEmisora>
          <ual:CantCotizaciones>1</ual:CantCotizaciones>
          <ual:Convenio>${UA_CONVENIO || ""}</ual:Convenio>
          <ual:Folleto></ual:Folleto>
          <ual:PaisOrigen>${paisOrigen || "ARGENTINA"}</ual:PaisOrigen>
          <ual:Destino>${destination || ""}</ual:Destino>
          <ual:TipoViaje>${tipoViaje || "Un viaje"}</ual:TipoViaje>
          <ual:FechaInicio>${fechaInicio}</ual:FechaInicio>
          <ual:FechaFin>${fechaFin}</ual:FechaFin>
          <ual:CantidadPasajeros>${cantidadPasajeros}</ual:CantidadPasajeros>
          <ual:PackFamiliar></ual:PackFamiliar>
          <ual:Edad1>${edad1}</ual:Edad1>
          <ual:Edad2></ual:Edad2>
          <ual:Edad3></ual:Edad3>
          <ual:Edad4></ual:Edad4>
          <ual:Edad5></ual:Edad5>
          <ual:Edad6></ual:Edad6>
          <ual:Edad7></ual:Edad7>
          <ual:Edad8></ual:Edad8>
          <ual:Edad9></ual:Edad9>
          <ual:Edad10></ual:Edad10>
          <ual:ApellidoContacto></ual:ApellidoContacto>
          <ual:NombreContacto></ual:NombreContacto>
          <ual:TelefonoContacto></ual:TelefonoContacto>
          <ual:EmailContacto></ual:EmailContacto>
        </ual:DatosLeadCotizadorIn>
      </ual:UALeadCotizadorReq>
    </cus:LeadCotizadorOper_Input>
  </soapenv:Body>
</soapenv:Envelope>`;
};

const normalizeResponse = (rawXml) => {
  if (!rawXml) return [];

  const parseOptions = { explicitArray: false, trim: true };
  return parseStringPromise(rawXml, parseOptions)
    .then((parsed) => {
      const envelope = parsed["SOAP-ENV:Envelope"] || parsed["soapenv:Envelope"] || parsed["Envelope"];
      const body = envelope?.["SOAP-ENV:Body"] || envelope?.["soapenv:Body"] || envelope?.Body;
      const output = body?.["ns:LeadCotizadorOper_Output"] || body?.LeadCotizadorOper_Output;
      const resp = output?.UALeadCotizadorResp || output?.["ns:UALeadCotizadorResp"] || output?.UALeadCotizadorResp;
      const items = resp?.DatosLeadCotizadorOut;
      if (!items) return [];
      if (Array.isArray(items)) return items;
      return [items];
    })
    .catch((error) => {
      console.error("UA parse error", error);
      return [];
    });
};

export async function POST(request) {
  if (!UA_URL) {
    return Response.json({ error: "UA_URL is not configured" }, { status: 500 });
  }

  const body = await request.json();

  try {
    const xmlPayload = buildAvailabilityEnvelope(body);

    const uaResponse = await fetch(UA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
      },
      body: xmlPayload,
      next: { revalidate: 0 },
    });

    const rawXml = await uaResponse.text();
    const plans = await normalizeResponse(rawXml);

    return Response.json({ plans, rawXml });
  } catch (error) {
    console.error("UA avail error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
