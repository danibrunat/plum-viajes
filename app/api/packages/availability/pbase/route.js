import { groq } from "next-sanity";
import { sanityFetch } from "../../../../../sanity/lib/sanityFetch";
import { Julia } from "../../../services/julia.service";
import { ProviderService } from "../../../services/providers.service";
import { OLA } from "../../../services/ola.service";

async function fetchPlumPackages({
  arrivalCity,
  departureCity,
  startDate,
  endDate,
}) {
  const pkgAvailQuery = groq`*[_type == "packages" 
    && "${departureCity}" in origin
    && "${arrivalCity}" in destination
    && now() > validDateFrom 
    && now() < validDateTo 
   // && departures[dateFromRt1 >= now()]
   ] {
    ...,
    "subtitle" : "Paquetes a " + origin[0] + " con aéreo " + departures[0].typeRt1 + " de " + departures[0].airlineRt1,
    "departures": departures[departureFrom > now()]
   }`;

  const sanityQuery = await sanityFetch({ query: pkgAvailQuery });
  const pkgAvailResponse = await sanityQuery;

  //console.log("PLUM | pkgAvailResponse", JSON.stringify(pkgAvailResponse));
  // console.log("PLUM | pkgAvailResponse", pkgAvailResponse);
  const mapResponse = ProviderService.mapper(pkgAvailResponse, "plum", "avail");
  console.log("mapResponse.hotels", JSON.stringify(mapResponse.hotels));
  return Response.json(mapResponse);
}

async function fetchOlaPackages(searchParams) {
  const { departureCity, arrivalCity, startDate, endDate, rooms } =
    searchParams;
  const formattedDateFrom = ProviderService.ola.olaDateFormat(startDate);
  const formattedDateTo = ProviderService.ola.olaDateFormat(endDate);
  // TODO: ARMAR UN GETSEARCHPARAMSBYPROVIDER PARA MAPEAR DIRECTAMENTE LOS SEARCH PARAMS SEGUN NECESITE EL PROVEEDOR
  const getPackagesFaresRequest = `<GetPackagesFaresRequest>
            <GeneralParameters>
              <Username>${process.env.OLA_USERNAME}</Username>
              <Password>${process.env.OLA_API_KEY}</Password>
              <CustomerIp>186.57.221.35</CustomerIp>
            </GeneralParameters>
             <DepartureDate>
            <From>${formattedDateFrom}</From>
            <To>${formattedDateTo}</To>
          </DepartureDate>
          <Rooms>
            <Room>
              <Passenger Type="ADL"/>
              <Passenger Type="ADL"/>
            </Room>
          </Rooms>
          <DepartureDestination>${departureCity}</DepartureDestination>
          <ArrivalDestination>${arrivalCity}</ArrivalDestination>
          <FareCurrency>ARS</FareCurrency>
          <Outlet>1</Outlet>
          <PackageType>ALL</PackageType>
            </GetPackagesFaresRequest>`;

  try {
    const olaAvailRequest = await fetch(
      OLA.avail.url(),
      OLA.avail.options(getPackagesFaresRequest)
    );

    const olaAvailResponse = await olaAvailRequest.json();
    // console.log("olaAvailResponse", olaAvailResponse);

    const mapResponse = ProviderService.mapper(
      olaAvailResponse,
      "ola",
      "avail"
    );
    const groupResponseSet = ProviderService.ola.grouper(mapResponse);
    return groupResponseSet;
  } catch (error) {
    console.log("error OLA", error);
  }
}

async function fetchJuliaPackages(searchParams) {
  const arrivalCity = "ASU";
  const departureCity = "BUE";
  const departureFrom = "2024-10-01";
  const departureTo = "2024-10-31";
  const occupation = "2";

  const juliaPkgResponse = await Julia.pkgAvail({
    arrivalCity,
    departureCity,
    departureFrom,
    departureTo,
    occupation,
  });
  const mapResponse = ProviderService.mapper(
    juliaPkgResponse,
    "julia",
    "avail"
  );
  //console.log("fetchJuliaPackages | pkgAvail ", juliaPkgResponse);
  return Response.json(mapResponse);
}

export async function POST(req, res) {
  const body = await req.json();
  const { searchParams } = body;
  const [plumPkg, olaPkg /*  juliaPkg  */] = await Promise.all([
    fetchPlumPackages(searchParams),
    fetchOlaPackages(searchParams),
    //  fetchJuliaPackages(searchParams),
  ]);

  const plumPkgResponse = await plumPkg.json();
  //const juliaPkgResponse = await juliaPkg.json();
  /*  console.log("// PLUM RESPONSE // ");
  console.log(JSON.stringify(plumPkgResponse));
  console.log("// PLUM RESPONSE END // ");

  console.log("// OLA RESPONSE // ");
  //console.log(JSON.stringify(olaPkg));
  console.log("// OLA RESPONSE END // "); */
  const packagesResponse = plumPkgResponse.concat(olaPkg);
  return Response.json(packagesResponse);
}
