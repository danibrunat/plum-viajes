import { Suspense } from "react";
import DeparturesForm from "./Form";
import Placeholder from "./Placeholder";
import PackageApiService from "../../../../../api/services/packages.service";

const Departures = async ({ searchParams }) => {
  const cacheDepartures = await PackageApiService.cache.get(searchParams.id);

  return (
    <div>
      <h1>Reservar Salida</h1>
      <Suspense fallback={<Placeholder />}>
        <DeparturesForm departures={cacheDepartures} />
      </Suspense>
    </div>
  );
};

export default Departures;
