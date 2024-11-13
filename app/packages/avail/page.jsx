import SearchEngines from "../../components/sections/SearchEngines";
import PkgGrid from "./_components/PkgGrid";
import PkgGridHeader from "./_components/PkgGrid/PkgGridHeader";
import { ProviderService } from "../../api/services/providers.service";

export const metadata = {
  title: "Paquetes | Plum Viajes",
  keywords: "Paquetes Plum Viajes El mejor precio para tu viaje",
};

// Convert to a Server Component
export default async function PackagesAvailability({ searchParams }) {
  const { arrivalCity, departureCity, startDate, endDate, rooms } =
    searchParams;

  const [searchEngineDefaultValues, pkgAvailabilityResponse] =
    await Promise.all([
      ProviderService.getSearchEngineDefaultValues(
        startDate,
        arrivalCity,
        departureCity
      ),
      ProviderService.getPkgAvailability({
        startDate,
        endDate,
        arrivalCity,
        departureCity,
        rooms,
      }),
    ]);

  return (
    <>
      <SearchEngines
        packages={true}
        defaultValues={searchEngineDefaultValues}
      />
      <div className="mx-2 py-2 md:py-5 md:mx-40">
        <PkgGridHeader searchParams={searchParams} />
        <PkgGrid
          availResponse={pkgAvailabilityResponse}
          searchParams={searchParams}
        />
      </div>
    </>
  );
}
