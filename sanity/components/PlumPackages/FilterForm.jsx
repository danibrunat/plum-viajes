import { useEffect, useRef, useState } from "react";
import { CitiesService } from "../../../app/services/cities.service";
import { OPERATORS } from "../../../app/constants/operators";
import { ORIGINS } from "../../../app/constants/origins";

const initialFilters = {
  title: "",
  destination: "",
  operator: "",
  origin: "",
};

const FilterForm = ({ setFilters }) => {
  const [filters, setLocalFilters] = useState(initialFilters);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (filters.destination.length > 2) {
      const fetchSuggestions = async () => {
        try {
          const suggestions = await CitiesService.getCitiesAutocompleteApi(
            filters.destination
          );
          setDestSuggestions(suggestions);
        } catch (error) {
          console.error("Error fetching destination suggestions:", error);
          setDestSuggestions([]);
        }
      };
      fetchSuggestions();
    } else {
      setDestSuggestions([]);
    }
  }, [filters.destination]);

  const handleSelectDestination = (city) => {
    setLocalFilters((prev) => ({ ...prev, destination: city.name }));
    setFilters((prev) => ({ ...prev, destination: city.value }));
    setDestSuggestions([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Filtro por título */}
      <input
        type="text"
        name="title"
        placeholder="Buscar texto en título"
        value={filters.title}
        className="p-2 border rounded-md shadow-sm"
        onChange={handleChange}
      />

      {/* Input de Destino con autocomplete */}
      <div className="relative">
        <input
          type="text"
          name="destination"
          placeholder="Ingresar destino"
          value={filters.destination}
          className="p-2 border rounded-md shadow-sm w-full"
          onChange={handleChange}
        />
        {destSuggestions.length > 0 && (
          <ul className="absolute z-10 left-0 right-0 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
            {destSuggestions.map((city) => (
              <li
                key={city.value}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectDestination(city)}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Select para Operador */}
      <select
        name="operator"
        value={filters.operator}
        className="p-2 border rounded-md shadow-sm"
        onChange={handleChange}
      >
        <option value="">Todos los operadores</option>
        {OPERATORS.map((operator) => (
          <option key={operator.id} value={operator.name}>
            {operator.name}
          </option>
        ))}
      </select>

      {/* Select para Origen */}
      <select
        name="origin"
        value={filters.origin}
        className="p-2 border rounded-md shadow-sm"
        onChange={handleChange}
      >
        <option value="">Cualquier ciudad de origen</option>
        {ORIGINS.map((origin) => (
          <option key={origin.id} value={origin.id}>
            {origin.cityName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterForm;
