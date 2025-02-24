import { Suspense } from "react";
import DeparturesForm from "./Form";
import Placeholder from "./Placeholder";
import PackageApiService from "../../../../../api/services/packages.service";

// TODO: HAY QUE HANDLEAR EL CAMBIO DE DEPARTURE.
const Departures = async ({ searchParams }) => {
  const cacheDepartures = await PackageApiService.cache.get(searchParams);
  const filterDeparturesByPkgId = cacheDepartures.filter(
    (cd) => cd.pkgId === searchParams.id
  );

  return (
    <div>
      <h1>Reservar Salida</h1>
      <Suspense fallback={<Placeholder />}>
        <DeparturesForm departures={filterDeparturesByPkgId[0].departures} />
      </Suspense>
    </div>
  );
};

export default Departures;
