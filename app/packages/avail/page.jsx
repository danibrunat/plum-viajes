import SearchEngines from "../../components/sections/SearchEngines";
import PkgGrid from "./_components/PkgGrid";
import PkgGridHeader from "./_components/PkgGrid/PkgGridHeader";
import { ProviderService } from "../../api/services/providers.service";
import { Filters } from "../../api/services/filters.service";

export const metadata = {
  title: "Paquetes | Plum Viajes",
  keywords: "Paquetes Plum Viajes El mejor precio para tu viaje",
};

// Convert to a Server Component
export default async function PackagesAvailability({ searchParams }) {
  const { arrivalCity, departureCity, startDate, endDate, rooms } =
    searchParams;

  // Generar selectedFilters en base a los filtros definidos en el servicio
  const selectedFilters = extractSelectedFilters(searchParams, Filters.config);
  console.log("selectedFilters", selectedFilters);
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
          rooms,
          // Pasamos los filtros seleccionados
        },
        selectedFilters
      ),
    ]);

  const packages = pkgAvailabilityResponse.packages;
  const filters = pkgAvailabilityResponse.filters;

  return (
    <>
      <SearchEngines
        packages={true}
        defaultValues={searchEngineDefaultValues}
      />
      <div className="mx-2 py-2 md:py-5 md:mx-40">
        <PkgGridHeader searchParams={searchParams} />
        <PkgGrid
          filters={filters}
          availResponse={packages}
          searchParams={searchParams}
        />
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
