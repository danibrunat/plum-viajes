import { CITIES } from "../../../constants/destinations";

export function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  //console.log("name", name);

  const dbCities = CITIES;

  const filteredCities = dbCities.filter((city) => {
    const cityName = city.name.toLowerCase();
    const nameParam = name.toLowerCase();
    if (cityName.indexOf(nameParam) > -1) return true;
    return false;
  });

  return Response.json(filteredCities);
}
