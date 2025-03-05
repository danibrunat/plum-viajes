import CACHE from "../../../constants/cachePolicies";
import { ApiUtils } from "../../services/apiUtils.service";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  //const input = searchParams.get("input");
  /* if (input === "arrivalCity") { */

  const citiesSearch = await ApiUtils.requestHandler(
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/cities/byName?name=${query}`, {
      method: "GET",
      next: {
        revalidate: CACHE.revalidation.cities,
      },
      headers: ApiUtils.getCommonHeaders(),
    }),
    "GET | Autocomplete Api"
  );
  const citiesResponse = await citiesSearch.json();
  console.log("citiesResponse", citiesResponse);
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
