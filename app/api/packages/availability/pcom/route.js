import { Api } from "../../../../services/api.service";
import pcomService from "../../../services/pcom.service";
import { Filters } from "../../../services/filters.service";

export async function POST(req, res) {
  const body = await req.json();
  const { searchParams, selectedFilters } = body;

  const pbaseAvailRequest = await fetch(
    Api.packages.avail.pbase.url(),
    Api.packages.avail.pbase.options(body)
  );
  const pbaseAvailResponse = await pbaseAvailRequest.json();

  const filters = await Filters.process(pbaseAvailResponse);

  // Aplicar los filtros seleccionados usando pcomService
  const filteredPackages = pcomService.avail.applySelectedFilters(
    pbaseAvailResponse,
    selectedFilters
  );

  // Ordenar paquetes por precio usando pcomService
  const sortedPackages = pcomService.avail.sortPackagesByBasePrice(
    filteredPackages,
    searchParams.priceOrder
  );

  return Response.json({ packages: sortedPackages, filters });
}
