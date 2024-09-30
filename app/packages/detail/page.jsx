import PkgDetail from "./PkgDetail";
import { ProviderService } from "../../api/services/providers.service";

export const metadata = {
  title: "Paquetes | Plum Viajes",
  keywords: "Paquetes Plum Viajes El mejor precio para tu viaje",
};

export default async function PackagesDetail({
  searchParams: { provider, id },
}) {
  const pkgDetailResponse = await ProviderService.getPkgDetail({
    provider,
    id,
  });

  return (
    <div className="mx-2 py-2 md:py-5 md:mx-40">
      <PkgDetail detailResponse={pkgDetailResponse} />
    </div>
  );
}
