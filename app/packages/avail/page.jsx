import SearchEngines from "../../components/sections/SearchEngines";
import PkgGridServer from "./PkgGridTestServer";
import PkgGridHeader from "./PkgGridTestServer/PkgGridHeader";
import { ProviderService } from "../../api/services/providers.service";
import { CitiesService } from "../../services/cities.service";

export const metadata = {
  title: "Paquetes | Plum Viajes",
  keywords: "Paquetes Plum Viajes El mejor precio para tu viaje",
};

// Convert to a Server Component
export default async function PackagesAvailability({ searchParams }) {
  const { arrivalCity, departureCity, startDate, endDate } = searchParams;

  const [searchEngineDefaultValues, pkgAvailabilityResponse] =
    await Promise.all([
      getSearchEngineDefaultValues(startDate, arrivalCity, departureCity),
      ProviderService.getPkgAvailability({
        startDate,
        endDate,
        arrivalCity,
        departureCity,
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
        <PkgGridServer
          availResponse={pkgAvailabilityResponse}
          searchParams={searchParams}
        />
      </div>
    </>
  );
}

// Helper function to get search engine default values
async function getSearchEngineDefaultValues(
  startDate,
  arrivalCity,
  departureCity
) {
  const [arrivalCityData, departureCityData] = await Promise.all([
    CitiesService.getCityByCode(arrivalCity, true),
    CitiesService.getCityByCode(departureCity, true),
  ]);

  return {
    packages: {
      departureMonthYear: ProviderService.departureDateMonthYear(startDate),
      arrivalCity: arrivalCityData,
      departureCity: departureCityData,
    },
  };
}
