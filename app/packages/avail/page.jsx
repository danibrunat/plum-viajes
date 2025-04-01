import SearchEngines from "../../components/sections/SearchEngines";
import PkgGrid from "./_components/PkgGrid";
import PkgGridHeader from "./_components/PkgGrid/PkgGridHeader";
import { ProviderService } from "../../api/services/providers.service";
import { Filters } from "../../api/services/filters.service";
import NoResults from "./_components/NoResults";

export const metadata = {
  title: "Paquetes | Plum Viajes",
  keywords: "Paquetes Plum Viajes El mejor precio para tu viaje",
};

// Convert to a Server Component
export default async function PackagesAvailability(props) {
  const searchParams = await props.searchParams;
  const {
    arrivalCity,
    departureCity,
    startDate,
    endDate,
    occupancy,
    priceOrder,
  } = searchParams;

  // Generar selectedFilters en base a los filtros definidos en el servicio
  const selectedFilters = extractSelectedFilters(searchParams, Filters.config);
  const [searchEngineDefaultValues, pkgAvailabilityResponse] =
    await Promise.all([
      ProviderService.getSearchEngineDefaultValues(
        startDate,
        arrivalCity,
        departureCity
      ),
      ProviderService.getPkgAvailabilityAndFilters(
        {
          startDate,
          endDate,
          arrivalCity,
          departureCity,
          occupancy,
          priceOrder,
          // Pasamos los filtros seleccionados
        },
        selectedFilters
      ),
    ]);

  const packages = pkgAvailabilityResponse.packages;
  const filters = pkgAvailabilityResponse.filters;
  const packagesQty = packages.length;

  return (
    <>
      <SearchEngines
        packages={true}
        defaultValues={searchEngineDefaultValues}
      />
      <div className="mx-2 py-2 md:py-5 md:mx-40">
        {packages.length > 0 ? (
          <>
            <PkgGridHeader
              searchParams={searchParams}
              packagesQty={packagesQty}
            />
            <PkgGrid
              filters={filters}
              availResponse={packages}
              searchParams={searchParams}
            />
          </>
        ) : (
          <NoResults />
        )}
      </div>
    </>
  );
}

// Función que extrae los filtros seleccionados
function extractSelectedFilters(searchParams, filtersConfig) {
  const selectedFilters = {};

  filtersConfig.forEach((filter) => {
    const filterValue = searchParams[filter.id];
    if (filterValue) {
      // Si el valor del filtro está presente en searchParams
      selectedFilters[filter.id] = filterValue.split(","); // Convertimos la cadena separada por comas a un array
    }
  });

  return selectedFilters;
}
