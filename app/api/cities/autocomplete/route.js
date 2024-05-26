export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const input = searchParams.get("input");
  console.log("input", input);
  if (input === "arrivalCity") {
    try {
      const citiesSearch = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/cities/byName?name=${query}`,
        {
          method: "GET",
          cache: "no-cache",
        }
      );
      const citiesResponse = await citiesSearch.json();

      const autocompleteResponse = citiesResponse.map(
        ({ id, name, label, countryName }) => ({
          id,
          name,
          label: `${label}, ${countryName}`,
          value: id,
        })
      );

      return Response.json(autocompleteResponse);
    } catch (error) {
      return Response.json({ error: error.message });
    }
  }

  if (input === "departureCity") {
    try {
      const citiesSearch = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/cities/departureCity?name=${query}`,
        { method: "GET", cache: "no-cache" }
      );
      const citiesResponse = await citiesSearch.json();

      const autocompleteResponse = citiesResponse.map(
        ({ id, name, label, countryName }) => ({
          id,
          name,
          label: `${label}, ${countryName}`,
          value: id,
        })
      );

      return Response.json(autocompleteResponse);
    } catch (error) {
      return Response.json({ error: error.message });
    }
  }
}
