import PkgDetail from "./_components/PkgDetail";
import { ProviderService } from "../../api/services/providers.service";
import Link from "next/link";

export const metadata = {
  title: "Paquetes | Plum Viajes",
  keywords: "Paquetes Plum Viajes El mejor precio para tu viaje",
  description: "Paquetes a Buzios - Detalle de paquetes",
};

export default async function PackagesDetail(props) {
  const searchParams = await props.searchParams;
  const {
    provider,
    id,
    arrivalCity,
    departureCity,
    startDate,
    endDate,
    priceId,
    occupancy,
    departureId,
  } = searchParams;
  const pkgDetailResponse = await ProviderService.getPkgDetail({
    provider,
    id,
    arrivalCity,
    departureCity,
    startDate,
    endDate,
    priceId,
    occupancy,
    departureId,
  });

  console.log("pkgDetailResponse", pkgDetailResponse);
  if (
    !pkgDetailResponse ||
    !pkgDetailResponse.departures ||
    pkgDetailResponse.departures.length === 0 ||
    pkgDetailResponse.error
  ) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Salida no disponible</h1>
          <p className="text-lg mb-4">
            Lo sentimos, esta salida ya no está disponible. Tenemos mucho mas
            para vos, ¡No dejes de buscar!
          </p>
          <Link href="/" className="text-blue-500 hover:underline">
            Volver a la página principal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-2 py-2 md:py-5 md:mx-40">
        <PkgDetail
          detailResponse={pkgDetailResponse}
          searchParams={searchParams}
        />
      </div>
    </>
  );
}
