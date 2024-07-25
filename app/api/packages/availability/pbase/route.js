import { groq } from "next-sanity";
import { sanityFetch } from "../../../../../sanity/lib/sanityFetch";
import { Julia } from "../../../services/julia.service";
import { ProviderService } from "../../../services/providers.service";

async function fetchPlumPackages({
  arrivalCity,
  departureCity,
  departureDate,
}) {
  const pkgAvailQuery = groq`*[_type == "packages" 
    && "${departureCity}" in origin
    && "${arrivalCity}" in destination
    && now() > validDateFrom 
    && now() < validDateTo 
   // && departures[departureDateRt1 >= now()]
   ] {
    ...,
    "subtitle" : "Paquetes a " + origin[0] + " con aéreo " + departures[0].typeRt1 + " de " + departures[0].airlineRt1
   }`;

  const sanityQuery = await sanityFetch({ query: pkgAvailQuery });
  const pkgAvailResponse = await sanityQuery;
  // console.log("PLUM | pkgAvailResponse", pkgAvailResponse);
  //const mapResponse = ProviderService.mapper(pkgAvailResponse, "plum");
  return Response.json(pkgAvailResponse);
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
  const mapResponse = ProviderService.mapper(juliaPkgResponse, "julia");
  //console.log("fetchJuliaPackages | pkgAvail ", juliaPkgResponse);
  return Response.json(mapResponse);
}

export async function POST(req, res) {
  const body = await req.json();
  const { searchParams } = body;
  const [plumPkg, juliaPkg] = await Promise.all([
    fetchPlumPackages(searchParams),
    fetchJuliaPackages(searchParams),
  ]);

  const plumPkgResponse = await plumPkg.json();
  const juliaPkgResponse = await juliaPkg.json();

  const packagesResponse = plumPkgResponse.concat(juliaPkgResponse);

  return Response.json(packagesResponse);
}
