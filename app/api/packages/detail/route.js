import { Api } from "../../../services/api.service";
import { ApiUtils } from "../../services/apiUtils.service";

export async function POST(req) {
  async function getHotelDataById(pkgHotelData) {
    pkgHotelData.id = 1;
    const hotelData = await ApiUtils.requestHandler(
      fetch(
        Api.hotels.getById.url(pkgHotelData?.id),
        Api.hotels.getById.options
      ),
      Api.hotels.getById.name
    );

    return hotelData;
  }

  const body = await req.json();
  /* PBase */
  const pkgDetailRequest = await fetch(
    Api.packages.detail.pbase.url(),
    Api.packages.detail.pbase.options(body)
  );
  const pkgDetailResponse = await pkgDetailRequest.json();
  console.log("pkgDetailResponse", pkgDetailResponse);
  const hotelData = await getHotelDataById(pkgDetailResponse);

  /* PCom */

  /* Response */

  return Response.json(pkgDetailResponse);
}
