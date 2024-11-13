import CACHE from "../../../constants/cachePolicies";
import { ApiUtils } from "../../services/apiUtils.service";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  //const input = searchParams.get("input");
  /* if (input === "arrivalCity") { */

  const citiesSearch = await ApiUtils.requestHandler(
    fetch(`${process.env.URL}/api/cities/byName?name=${query}`, {
      method: "GET",
      next: {
        revalidate: CACHE.revalidation.cities,
      },
      headers: ApiUtils.getCommonHeaders(),
    }),
    "GET | Autocomplete Api"
  );
  const citiesResponse = await citiesSearch.json();
  const autocompleteResponse = citiesResponse.map(
    ({ id, name, country_name, region_name, iata_code }) => ({
      id,
      name,
      label: `${name}, ${country_name}`,
      value: iata_code,
    })
  );

  return Response.json(autocompleteResponse);
  /*  } */

  /* if (input === "departureCity") {
    try {
      const citiesSearch = await fetch(
        `${process.env.URL}/api/cities/departureCity?name=${query}`,
        { method: "GET", cache: "no-cache" }
      );
      const citiesResponse = await citiesSearch.json();

      const autocompleteResponse = citiesResponse.map(
        ({ id, name, country_name, region_name, iata_code }) => ({
          id,
          name,
          label: `${name}, ${country_name}`,
          value: iata_code,
        })
      );

      return Response.json(autocompleteResponse);
    } catch (error) {
      return Response.json({ error: error.message });
    }
  } */
}
