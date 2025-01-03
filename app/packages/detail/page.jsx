import PkgDetail from "./_components/PkgDetail";
import { ProviderService } from "../../api/services/providers.service";
import ReservationSummary from "./_components/PkgDetail/ReservationSummary";

export const metadata = {
  title: "Paquetes | Plum Viajes",
  keywords: "Paquetes Plum Viajes El mejor precio para tu viaje",
  description: "Paquetes a Buzios - Detalle de paquetes",
};

export default async function PackagesDetail({
  searchParams: {
    provider,
    id,
    arrivalCity,
    departureCity,
    startDate,
    endDate,
    priceId,
    rooms,
  },
}) {
  const pkgDetailResponse = await ProviderService.getPkgDetail({
    provider,
    id,
    arrivalCity,
    departureCity,
    startDate,
    endDate,
    priceId,
    rooms,
  });

  console.log("pkgDetailResponse", pkgDetailResponse);

  return (
    <>
      <div className="mx-2 py-2 md:py-5 md:mx-40">
        <PkgDetail detailResponse={pkgDetailResponse} />
      </div>
      <ReservationSummary />
    </>
  );
}
