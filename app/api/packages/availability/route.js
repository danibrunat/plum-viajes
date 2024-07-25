import { urls } from "../../../services/urls.service";

export async function POST(req) {
  const body = await req.json();
  /* PBase */
  const pkgAvailRequest = await fetch(
    urls.packages.avail.pbase.url(),
    urls.packages.avail.pbase.options(body),
    { next: { revalidate: 3600 } }
  );

  /* PCom */

  /* Response */

  const pkgAvailResponse = await pkgAvailRequest.json();

  return Response.json(pkgAvailResponse);
}
