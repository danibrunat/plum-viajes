export function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  //console.log("name", name);

  const departureCities = [
    { id: "ASU", name: "Asunción", countryName: "Paraguay", label: "Asunción" },
    {
      id: "BHI",
      name: "Bahía Blanca",
      countryName: "Argentina",
      label: "Bahía Blanca",
    },
    {
      id: "BUE",
      name: "Buenos Aires",
      countryName: "Argentina",
      label: "Buenos Aires",
    },
  ];

  const filteredCities = departureCities.filter((city) => {
    const cityName = city.name.toLowerCase();
    const nameParam = name.toLowerCase();
    if (cityName.indexOf(nameParam) > -1) return true;
    return false;
  });

  return Response.json(filteredCities);
}
