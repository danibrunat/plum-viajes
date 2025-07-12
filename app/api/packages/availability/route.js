import { Api } from "../../../services/api.service";
import { CacheService } from "../../services/cache";

export async function POST(req) {
  const body = await req.json();
  const { searchParams, selectedFilters } = body;

  // Intentar obtener desde cache
  const cachedResponse = await CacheService.packages.getAvailabilityFromCache(
    searchParams,
    selectedFilters
  );

  if (cachedResponse) {
    console.log("Cache HIT - Devolviendo datos cacheados");
    return Response.json(cachedResponse);
  }

  console.log("Cache MISS - Obteniendo datos frescos");

  /* Pcom: Aplica políticas de negocio y lógica específica de cómo se visualizan los datos. Armado de datos para la decisión de negocio. */
  const pkgAvailRequest = await fetch(
    Api.packages.avail.pcom.url(),
    Api.packages.avail.pcom.options(body)
  );

  const pkgAvailResponse = await pkgAvailRequest.json();
  if (pkgAvailResponse.packages.length > 0) {
    // Guardar en cache para futuras consultas (usando políticas centralizadas)
    await CacheService.packages.setAvailabilityCache(
      searchParams,
      selectedFilters,
      pkgAvailResponse
      // El TTL se obtiene automáticamente de las políticas
    );
  }

  return Response.json(pkgAvailResponse);
}
