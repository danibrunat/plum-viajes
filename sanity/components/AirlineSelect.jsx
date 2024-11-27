import React, { useEffect, useState } from "react";
import { Api } from "../../app/services/api.service";
import { PatchEvent, set, unset } from "sanity";

const AirlineSelect = ({ value, onChange }) => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener las aerolíneas desde la API
    const fetchAirlines = async () => {
      try {
        const response = await fetch(
          Api.airlines.get.url(),
          Api.airlines.get.options()
        );
        const data = await response.json();
        setAirlines(data); // Guardar las aerolíneas en el estado
      } catch (error) {
        console.error("Error fetching airlines:", error);
        setAirlines([]); // En caso de error, se asigna un arreglo vacío
      } finally {
        setLoading(false); // Terminar de cargar
      }
    };

    fetchAirlines(); // Llamar la API para obtener las aerolíneas
  }, []);

  // Manejo de cambios de selección
  const handleChange = (e) => {
    const selectedAirlineId = e.target.value;
    const selectedAirline = airlines.find(
      (airline) => airline.id === Number(selectedAirlineId)
    );

    if (selectedAirline) {
      // Aquí, utilizamos PatchEvent para actualizar el valor en Sanity
      onChange(
        PatchEvent.from(
          set({
            id: selectedAirline.id,
            name: selectedAirline.name,
          })
        )
      );
    } else {
      onChange(unset()); // Si no se selecciona nada, eliminamos el valor
    }
  };

  if (loading) {
    return <p>Loading airlines...</p>;
  }

  return (
    <select value={value?.id || ""} onChange={handleChange}>
      <option value="">Select an Airline</option>
      {airlines.map((airline) => (
        <option key={airline.id} value={airline.id}>
          {airline.name}
        </option>
      ))}
    </select>
  );
};

export default AirlineSelect;
