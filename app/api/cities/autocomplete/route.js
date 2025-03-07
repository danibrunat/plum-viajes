import CACHE from "../../../constants/cachePolicies";
import { ApiUtils } from "../../services/apiUtils.service";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  //const input = searchParams.get("input");
  /* if (input === "arrivalCity") { */
  const host = req.headers.get("host"); // Obtiene el host actual (ej. plum-viajes.vercel.app)
  console.log("host", host);
  const citiesSearch = await ApiUtils.requestHandler(
    fetch(`https://${host}/api/cities/byName?name=${query}`, {
      method: "GET",
      next: {
        revalidate: CACHE.revalidation.cities,
      },
      headers: ApiUtils.getCommonHeaders(),
    }),
    "GET | Autocomplete Api"
  );
  console.log("citiesResponse", citiesResponse);
  const citiesResponse = await citiesSearch.json();

  if (!citiesResponse || citiesResponse.length === 0) {
    throw new Error("No cities found");
  }
  const autocompleteResponse = citiesResponse.map(
    ({ _id, name, country_name, region_name, iata_code }) => ({
      id: _id,
      name,
      label: `${name}, ${country_name}`,
      value: iata_code,
    })
  );

  return Response.json(autocompleteResponse);
}
