import CACHE from "../../../constants/cachePolicies";
import { ApiUtils } from "../../services/apiUtils.service";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  //const input = searchParams.get("input");
  /* if (input === "arrivalCity") { */
  const host = req.headers.get("host"); // Obtiene el host actual (ej. plum-viajes.vercel.app)
  const citiesSearch = await ApiUtils.requestHandler(
    fetch(
      `${!host.includes("localhost") ? `https` : `http`}://${host}/api/cities/byName?name=${query}`,
      {
        method: "GET",
        next: {
          revalidate: CACHE.revalidation.cities,
        },
        headers: ApiUtils.getCommonHeaders(),
      }
    ),
    "GET | Autocomplete Api"
  );
  const citiesResponse = await citiesSearch.json();
  if (!citiesResponse || citiesResponse.length === 0) {
    return Response.json([
      { label: "No se encontraron resultados", value: "" },
    ]);
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
