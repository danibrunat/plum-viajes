import DatabaseService from "../../services/database.service";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  //console.log("name", name);

  const response = await DatabaseService.getByFieldIlike(
    "cities",
    "name",
    name
  );

  if (response?.error) Response.json(response?.error);

  return Response.json(response);
}
