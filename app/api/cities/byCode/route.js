import { CITIES } from "../../../constants/destinations";

export function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  //console.log("name", name);

  const dbCities = CITIES;

  const filteredCities = dbCities.filter((city) => city.id === code);

  return Response.json(filteredCities);
}
