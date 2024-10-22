import { cookies } from "next/headers";
import DatabaseService from "../../services/database.service";

export async function GET(req) {
  const cookieStore = cookies();
  const supabase = DatabaseService.serverClient(cookieStore);
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  //console.log("name", name);

  const { data, error } = await supabase
    .from("cities")
    .select()
    .eq("iata_code", code);

  if (error) Response.json(error);

  return Response.json(data);
}
