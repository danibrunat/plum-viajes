import DatabaseService from "../../services/database.service";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  //console.log("name", name);

  const { data, error } = await DatabaseService.getByFieldIlike(
    "cities",
    "name",
    name
  );

  if (error)
    throw new Error(`No se encontró ciudad con la instrucción ${name}`);

  return Response.json(data);
}
