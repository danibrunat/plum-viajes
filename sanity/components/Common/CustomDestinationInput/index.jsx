import React, { useState, useEffect } from "react";
import { Stack, Card, Badge, TextInput, Button, Text, Box } from "@sanity/ui";
import { FormField, PatchEvent, set, unset } from "sanity";
import { debounce } from "lodash";

// Componente principal
const CustomDestinationInput = React.forwardRef((props, ref) => {
  const { value = [], onChange, schemaType } = props;
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para buscar ciudades en la API (optimizada con debounce)
  const fetchCities = debounce(async (search) => {
    if (search.length < 3) return setSuggestions([]); // No buscar hasta 3 caracteres
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.SANITY_STUDIO_URL}/api/cities/autocomplete?query=${search}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchCities(query);
  }, [query]);

  // Agregar ciudad seleccionada al array
  const handleAddCity = (city) => {
    if (!value.includes(city.value)) {
      const newValue = [...value, city.value];
      onChange(PatchEvent.from(set(newValue)));
    }
    setQuery(""); // Limpiar input después de agregar
    setSuggestions([]);
  };

  // Eliminar ciudad del array
  const handleRemoveCity = (iataCode) => {
    const newValue = value.filter((code) => code !== iataCode);
    onChange(
      newValue.length > 0
        ? PatchEvent.from(set(newValue))
        : PatchEvent.from(unset())
    );
  };

  return (
    <FormField title={schemaType.title}>
      <Stack space={3}>
        {/* Input para buscar ciudades */}
        <TextInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar ciudad..."
        />
        {/* Lista de sugerencias */}
        {loading && <Text size={1}>Buscando...</Text>}
        {!loading && suggestions.length > 0 && (
          <Box
            padding={2}
            style={{ background: "#f3f3f3", borderRadius: "5px" }}
          >
            {suggestions.map((city) => (
              <Button
                key={city.value}
                text={city.label}
                onClick={() => handleAddCity(city)}
                tone="positive"
                mode="ghost"
              />
            ))}
          </Box>
        )}
        {/* Lista de ciudades seleccionadas */}
        {value.length > 0 && (
          <Stack space={2}>
            {value.map((iataCode) => (
              <Card
                key={iataCode}
                padding={2}
                radius={2}
                shadow={1}
                tone="positive"
              >
                <Stack space={1} direction="horizontal">
                  <Badge>{iataCode}</Badge>
                  <Button
                    text="X"
                    tone="critical"
                    onClick={() => handleRemoveCity(iataCode)}
                  />
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </FormField>
  );
});

export default CustomDestinationInput;
