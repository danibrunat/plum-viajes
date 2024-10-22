import { groq } from "next-sanity";
import { sanityFetch } from "../../../../../sanity/lib/sanityFetch";
import { Julia } from "../../../services/julia.service";
import { ProviderService } from "../../../services/providers.service";
import { OLA } from "../../../services/ola.service";

async function fetchPlumPackageDetail(id) {
  const pkgDetailQuery = groq`*[
    _id == "${id}" && 
    now() > validDateFrom && 
    now() < validDateTo]
    {
    ...,
    "subtitle" : "Paquetes a " + origin[0] + " con aéreo " + departures[0].typeRt1 + " de " + departures[0].airlineRt1,
    "departures": departures[departureFrom > now()]
   }`;

  const sanityQuery = await sanityFetch({ query: pkgDetailQuery });
  const pkgDetailResponse = await sanityQuery;
  // console.log("PLUM | pkgAvailResponse", pkgAvailResponse);
  const mapResponse = ProviderService.mapper(
    pkgDetailResponse,
    "plum",
    "detail"
  );
  // TODO refactor when detail mapper is ready
  return Response.json(mapResponse[0]);
}

async function fetchOlaPackageDetail() {
  const { departureCity, arrivalCity, startDate, endDate } = searchParams;
  const formattedDateFrom = ProviderService.ola.olaDateFormat(startDate);
  const formattedDateTo = ProviderService.ola.olaDateFormat(endDate);
  // ARMAR UN GETSEARCHPARAMSBYPROVIDER PARA MAPEAR DIRECTAMENTE LOS SEARCH PARAMS SEGUN NECESITE EL PROVEEDOR
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
    const olaAvail = await OLA.avail(getPackagesFaresRequest);
    // console.log("olaAvail", olaAvail);
    const mapResponse = ProviderService.mapper(olaAvail, "ola", "detail");
    const groupResponseSet = ProviderService.ola.grouper(mapResponse);
    return groupResponseSet;
  } catch (error) {
    console.log("error OLA", error);
  }
}

/* async function fetchJuliaPackageDetail(searchParams) {
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
    "detail"
  );
  //console.log("fetchJuliaPackages | pkgAvail ", juliaPkgResponse);
  return Response.json(mapResponse);
} */

export async function POST(req, res) {
  const body = await req.json();
  const { provider, id } = body;

  // check the provider and fetch the corresponding package detail
  switch (provider) {
    case "plum":
      const plumPkgDetail = await fetchPlumPackageDetail(id);

      const response = await plumPkgDetail.json();
      return Response.json(response);
    case "ola":
      const olaPkgDetail = await fetchOlaPackageDetail(id);
      const responseOla = await olaPkgDetail.json();
      return Response.json(responseOla);
    case "julia":
      const juliaPkgDetail = await fetchJuliaPackageDetail(id);
      const responseJulia = await juliaPkgDetail.json();
      return Response.json(responseJulia);
  }
}
