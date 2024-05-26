import { groq } from "next-sanity";
import { sanityFetch } from "../../../../sanity/lib/sanityFetch";

export async function POST(req) {
  const body = await req.json();
  const {
    searchParams: { arrivalCity, departureCity, departureDate },
  } = body;
  const pkgAvailQuery = groq`*[_type == "packages" 
  && "${departureCity}" in origin
  && "${arrivalCity}" in destination
  && now() > validDateFrom 
  && now() < validDateTo 
 // && departures[departureDateRt1 >= now()]
 ]`;

  const sanityQuery = await sanityFetch({ query: pkgAvailQuery });
  const pkgAvailResponse = await sanityQuery;

  return Response.json(pkgAvailResponse);
}
