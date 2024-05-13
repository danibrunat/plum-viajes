import FlightsEngine from "../components/sections/SearchEngines/FlightsEngine";
import PackagesEngine from "../components/sections/SearchEngines/PackagesEngine";

export const departureDateMonths = [
  { id: 1, value: "05-2024", label: "Mayo, 2024" },
  { id: 2, value: "06-2024", label: "Junio, 2024" },
  { id: 3, value: "07-2024", label: "Julio, 2024" },
  { id: 4, value: "08-2024", label: "Agosto, 2024" },
];

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
