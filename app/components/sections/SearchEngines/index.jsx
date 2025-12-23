import { Tabs, Tab } from "../../commons/Tabs";
import FlightsEngine from "./FlightsEngine";
import PackagesEngine from "./PackagesEngine";
import AssistanceEngine from "./AssistanceEngine";

export default function SearchEngines({
  assurances,
  hotels,
  flights,
  packages,
  defaultValues = {},
}) {
  return (
    <section className="mx-2 py-5 md:mx-12 lg:w-3/5 lg:mx-auto">
      <Tabs className="py-5">
        {packages ? (
          <Tab label="Buscar Paquetes">
            <div className=" bg-plumPrimaryPurple py-4">
              <PackagesEngine defaultValues={defaultValues?.packages} />
            </div>
          </Tab>
        ) : (
          <></>
        )}

        {flights ? (
          <Tab label="Vuelos">
            <div className=" bg-plumPrimaryPurple py-4">
              <FlightsEngine />
            </div>
          </Tab>
        ) : (
          <></>
        )}

          <Tab label="Asistencia al Viajero">
            <div className=" bg-plumPrimaryPurple py-4">
              <AssistanceEngine defaultValues={defaultValues?.assistance} />
            </div>
          </Tab>
        {hotels ? (
          <Tab label="Hoteles">
            <div className=" bg-plumPrimaryPurple py-4">
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
