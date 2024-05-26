import { Tabs, Tab } from "../../commons/Tabs";
import FlightsEngine from "./FlightsEngine";
import PackagesEngine from "./PackagesEngine";

export default function SearchEngines({
  assurances,
  hotels,
  flights,
  packages,
  defaultValues = {},
}) {
  return (
    <section className="mx-2 py-5 md:mx-12">
      <Tabs className="py-5">
        {packages ? (
          <Tab label="Buscar Paquetes">
            <div className=" bg-plumPrimaryPink py-4">
              <PackagesEngine defaultValues={defaultValues?.packages} />
            </div>
          </Tab>
        ) : (
          <></>
        )}

        {flights ? (
          <Tab label="Vuelos">
            <div className=" bg-plumPrimaryPink py-4">
              <FlightsEngine />
            </div>
          </Tab>
        ) : (
          <></>
        )}

        {assurances ? (
          <Tab label="Asistencia al Viajero">
            <div className=" bg-plumPrimaryPink py-4">
              <h1>Assurances</h1>
            </div>
          </Tab>
        ) : (
          <></>
        )}

        {hotels ? (
          <Tab label="Hoteles">
            <div className=" bg-plumPrimaryPink py-4">
              <h1>Hotels</h1>
            </div>
          </Tab>
        ) : (
          <></>
        )}
      </Tabs>
    </section>
  );
}
