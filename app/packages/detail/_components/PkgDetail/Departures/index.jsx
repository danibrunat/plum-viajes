import { Suspense } from "react";
import DeparturesForm from "./Form";
import Placeholder from "./Placeholder";
import PackageApiService from "../../../../../api/services/packages.service";

const Departures = async ({ searchParams }) => {
  const cacheDepartures = await PackageApiService.cache.get(searchParams.id);

  return (
    <Suspense fallback={<Placeholder />}>
      <DeparturesForm departures={cacheDepartures} />
    </Suspense>
  );
};

export default Departures;
