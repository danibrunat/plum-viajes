import { groq } from "next-sanity";
import { sanityFetch } from "../../../../../sanity/lib/sanityFetch";
import { ProviderService } from "../../../services/providers.service";
import { OLA } from "../../../services/ola.service";
import { ApiUtils } from "../../../services/apiUtils.service";
import { getPriceTypeFromOccupancy } from "../../helpers";

async function fetchPlumPackageDetail({ occupancy, id, startDate, endDate }) {
  const priceType = getPriceTypeFromOccupancy(occupancy);
  const pkgDetailQuery = groq`*[
    _id == "${id}" && 
    now() > validDateFrom && 
    now() < validDateTo]
    {
    ...,
    "subtitle" : "Paquetes a " + origin[0] + " con aéreo " + departures[0].typeRt1 + " de " + departures[0].airlineRt1,
    "departures": departures[departureFrom >= "${startDate}" && departureFrom <= "${endDate}"] {
      ...,
       // Desreferenciar el array de hoteles
       "hotels": hotels[]-> {
        "id": _id,
        name, 
        stars, 
        description, 
        latitude, 
        longitude, 
        plum_id,
        
        // Desreferenciamos la ciudad
        "city": city_id-> {
          iata_code,
          name,
          country_name,
          "images": coalesce(images[].asset->url, []),
        }
      },
    
      "flights": [
          {
            "segments": {
              "flightNumber": flightNumberRt1,
              "departureDate": departureDateRt1,
              "departureHour": departureTimeRt1,
              "arrivalDate": arrivalDateRt1,
              "arrivalHour": arrivalTimeRt1,
              "airline": airlineRt1-> {
                      code,
                      name,
                      "logoUrl": logo.asset->url
                    },              
              "departureAirport": "Airport",
              "arrivalAirport": "Airport",
              "stopovers": stopoverRt1,
              "departureCity": originDestinationRt1,
              "arrivalCity": arrivalDestinationRt1
            }
          },
          {
            "segments": {
              "flightNumber": flightNumberRt2,
              "departureDate": departureDateRt2,
              "departureHour": departureTimeRt2,
              "arrivalDate": arrivalDateRt2,
              "arrivalHour": arrivalTimeRt2,
              "airline": airlineRt2-> {
                      code,
                      name,
                      "logoUrl": logo.asset->url
                    },              
              "departureAirport": "Airport",
              "arrivalAirport": "Airport",
              "stopovers": stopoverRt2,
              "departureCity": originDestinationRt2,
              "arrivalCity": arrivalDestinationRt2

            }
          }
        ],
        "prices": prices[type == "${priceType}"] 
    }
   }`;

  const sanityQuery = await sanityFetch({ query: pkgDetailQuery });
  const pkgDetailResponse = await sanityQuery;
  console.log("pkgDetailResponse", JSON.stringify(pkgDetailResponse, null, 2));
  const mapResponse = ProviderService.mapper(
    pkgDetailResponse,
    "plum",
    "detail"
  );

  console.log("mapResponse", JSON.stringify(mapResponse, null, 2));

  return Response.json(mapResponse[0]);
}

async function fetchOlaPackageDetail(id, searchParams) {
  const { departureCity, arrivalCity, startDate, endDate, priceId, occupancy } =
    searchParams;
  const cacheKey = `${id}-${priceId}`;

  const roomConfig = ProviderService.getRoomsConfig(occupancy);
  const xmlRooms =
    ProviderService.ola.generateXMLRoomsByConfigString(roomConfig);

  // Generar requests XML
  const getPackagesFaresRequest = generateXMLRequest(
    departureCity,
    arrivalCity,
    startDate,
    endDate,
    xmlRooms
  );
  const olaPkgDetailRequest = await ApiUtils.requestHandler(
    fetch(
      OLA.detail.url(),
      OLA.detail.options(getPackagesFaresRequest, `${cacheKey}`)
    ),
    "pkgSearch"
  );

  const olaResponse = await olaPkgDetailRequest.json();

  if (olaResponse.length === 0) return olaResponse;
  // Mapeo de ambas respuestas
  const mappedOriginalResponse = ProviderService.mapper(
    olaResponse,
    "ola",
    "detail"
  );

  // Buscar el paquete seleccionado

  const selectedPackage = mappedOriginalResponse.find((pkg) =>
    pkg.departures.some((departure) => departure.prices?.id === priceId)
  );

  return selectedPackage;
}

// Genera el request XML para GetPackagesFares
function generateXMLRequest(
  departureCity,
  arrivalCity,
  fromDate,
  toDate,
  xmlRooms
) {
  return `<GetPackagesFaresRequest>
      <GeneralParameters>
        <Username>${process.env.OLA_USERNAME}</Username>
        <Password>${process.env.OLA_API_KEY}</Password>
        <CustomerIp>186.57.221.35</CustomerIp>
      </GeneralParameters>
      <DepartureDate>
        <From>${fromDate}</From>
        <To>${toDate}</To>
      </DepartureDate>
      ${xmlRooms}
      <DepartureDestination>${departureCity}</DepartureDestination>
      <ArrivalDestination>${arrivalCity}</ArrivalDestination>
      <FareCurrency>ARS</FareCurrency>
      <Outlet>1</Outlet>
      <PackageType>ALL</PackageType>
    </GetPackagesFaresRequest>`;
}

/* async function fetchJuliaPackageDetail(searchParams) {
  const arrivalCity = "ASU";
  const departureCity = "BUE";
  const departureFrom = "2024-10-01";
  const departureTo = "2024-10-31";
  const occupancy = "2";

  const juliaPkgResponse = await Julia.pkgAvail({
    arrivalCity,
    departureCity,
    departureFrom,
    departureTo,
    occupancy,
  });
  const mapResponse = ProviderService.mapper(
    juliaPkgResponse,
    "julia",
    "detail"
  );
  //console.log("fetchJuliaPackages | pkgAvail ", juliaPkgResponse);
  return Response.json(mapResponse);
} */

export async function POST(req, res) {
  const body = await req.json();
  const {
    provider,
    id,
    departureCity,
    arrivalCity,
    startDate,
    endDate,
    priceId,
    occupancy,
  } = body;
  const searchParams = {
    departureCity,
    arrivalCity,
    startDate,
    endDate,
    priceId,
    occupancy,
  };
  // check the provider and fetch the corresponding package detail
  switch (provider) {
    case "plum":
      const plumPkgDetail = await fetchPlumPackageDetail(body);
      const response = await plumPkgDetail.json();
      return Response.json(response);
    case "ola":
      const olaPkgDetail = await fetchOlaPackageDetail(id, searchParams);
      return Response.json(olaPkgDetail);
    case "julia":
    /*  const juliaPkgDetail = await fetchJuliaPackageDetail(id);
      const responseJulia = await juliaPkgDetail.json();
      return Response.json(responseJulia); */
  }
}
