import FlightsEngine from "../components/sections/SearchEngines/FlightsEngine";
import PackagesEngine from "../components/sections/SearchEngines/PackagesEngine";

export const searchEngines = [
  {
    id: "packages",
    component: <PackagesEngine />,
    formId: "pkgSearchForm",
    label: "Buscar Paquetes",
  },
  {
    id: "flights",
    component: <FlightsEngine />,
    label: "Vuelos",
  },
  {
    id: "hotels",
    component: <h1>Hotels</h1>,
    label: "Hoteles",
  },
  {
    id: "assurances",
    component: <h1>Assurances</h1>,
    label: "Asistencia al Viajero",
  },
];
