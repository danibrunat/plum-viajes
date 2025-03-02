import DatabaseService from "../services/database.service";

export async function GET(req) {
  const response = await DatabaseService.get("cities");

  if (response?.error) return Response.json(response?.error);

  return Response.json(response);
}
