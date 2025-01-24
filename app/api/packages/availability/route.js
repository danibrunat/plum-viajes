import { Api } from "../../../services/api.service";

export async function POST(req) {
  const body = await req.json();
  /* PBase */
  const pkgAvailRequest = await fetch(
    Api.packages.avail.pbase.url(),
    Api.packages.avail.pbase.options(body)
  );

  /* PCom */

  /* Response */

  const pkgAvailResponse = await pkgAvailRequest.json();
  console.log("pkgAvailResponse", pkgAvailResponse);

  return Response.json(pkgAvailResponse);
}
