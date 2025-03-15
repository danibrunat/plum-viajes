import { Api } from "../../../services/api.service";

export async function POST(req) {
  const body = await req.json();
  /* Pcom: Aplica políticas de negocio y lógica específica de cómo se visualizan los datos. Armado de datos para la decisión de negocio. */
  const pkgAvailRequest = await fetch(
    Api.packages.avail.pcom.url(),
    Api.packages.avail.pcom.options(body)
  );

  const pkgAvailResponse = await pkgAvailRequest.json();

  return Response.json(pkgAvailResponse);
}
