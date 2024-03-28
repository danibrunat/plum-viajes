import { FaCalendar, FaGlobeAmericas, FaMapMarked } from "react-icons/fa";
import FlightsEngine from "../components/sections/SearchEngines/FlightsEngine";
import PackagesEngine from "../components/sections/SearchEngines/PackagesEngine";
import Autocomplete from "../components/sections/SearchEngines/Autocomplete";

export const searchEngines = [
  {
    id: "packages",
    component: <PackagesEngine />,
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

export const packageEngineItems = [
  {
    id: "where",
    title: "¿Dónde querés ir?",
    icon: <FaGlobeAmericas className="text-gray-200" />,
    children: <Autocomplete id="where" />,
  },
  {
    id: "when",
    title: "¿Cuándo pensás viajar?",
    icon: <FaCalendar className="text-gray-200" />,
    children: (
      <select name="when" id="when" className="w-full p-1">
        <option value="">Elegí el mes de tu viaje...</option>
        <option value="">Marzo</option>
        <option value="">Abril</option>
        <option value="">Mayo</option>
        <option value="">Junio</option>
        <option value="">Julio</option>
      </select>
    ),
  },
  {
    id: "from",
    title: "¿Desde qué ciudad partís?",
    icon: <FaMapMarked className="text-gray-200" />,
    children: (
      <select className="w-full p-1" name="from" id="from">
        <option value="">Indistinto</option>
        <option value="">Asunción</option>
        <option value="">Bahía Blanca</option>
        <option value="">Bariloche</option>
        <option value="">Buenos Aires</option>
        <option value="">Córdoba</option>
      </select>
    ),
  },
];
