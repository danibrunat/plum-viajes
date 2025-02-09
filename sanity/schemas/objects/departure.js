import { defineField } from "sanity";
import HotelSelect from "../../components/HotelSelect";
import AirlineSelect from "../../components/AirlineSelect";

export default defineField({
  title: "Salida",
  name: "departure",
  type: "object",
  fieldsets: [
    {
      title:
        "Para fechas de salidas especificas, 'Salidas desde' y 'Salidas hasta' deben coincidir",
      name: "departures",
      options: { columns: 4 },
    },
    {
      title: "Información de los vuelos incluídos en el paquete Ida",
      name: "roundTripFlight1",
      options: { columns: 3 },
    },
    {
      title: "Información de los vuelos incluídos en el paquete Vuelta",
      name: "roundTripFlight2",
      options: { columns: 3 },
    },
    {
      title: "Hoteles",
      name: "hotels",
      options: { columns: 1 },
    },
    {
      title: "Tarifas",
      name: "prices",
      options: { columns: 1 },
    },
  ],

  fields: [
    {
      name: "departureFrom",
      type: "date",
      title: "Salida desde",
      fieldset: "departures",
    },
    {
      name: "departureTo",
      type: "date",
      title: "Salida hasta",
      fieldset: "departures",
    },
    {
      name: "departureSeats",
      type: "number",
      title: "Cupos",
      fieldset: "departures",
    },
    {
      name: "departureActive",
      type: "number",
      title: "Disponible",
      fieldset: "departures",
      options: {
        list: [
          { title: "SI", value: 1 },
          { title: "NO", value: 0 },
        ],
      },
    },
    {
      name: "originDestinationRt1",
      type: "string",
      title: "Origen",
      fieldset: "roundTripFlight1",
    },
    {
      name: "departureDateRt1",
      type: "date",
      title: "Salida",
      fieldset: "roundTripFlight1",
    },
    {
      name: "departureTimeRt1",
      type: "string",
      title: "Hora",
      fieldset: "roundTripFlight1",
    },
    {
      name: "arrivalDestinationRt1",
      type: "string",
      title: "Destino",
      fieldset: "roundTripFlight1",
    },
    {
      name: "arrivalDateRt1",
      type: "date",
      title: "Llegada",
      fieldset: "roundTripFlight1",
    },
    {
      name: "arrivalTimeRt1",
      type: "string",
      title: "Hora",
      fieldset: "roundTripFlight1",
    },
    {
      name: "typeRt1",
      type: "string",
      title: "Tipo de vuelo",
      options: {
        list: [
          {
            title: "Vuelo regular",
            value: "regular",
          },
          {
            title: "Vuelo charter",
            value: "charter",
          },
          {
            title: "Cupos confirmados",
            value: "confirmedSeats",
          },
          {
            title: "Vuelo especial",
            value: "special",
          },
        ],
      },
      fieldset: "roundTripFlight1",
    },
    defineField({
      name: "airlineRt1",
      type: "object",
      title: "Aerolínea",
      fieldset: "roundTripFlight1", // Agrupación opcional
      fields: [
        defineField({
          name: "id",
          type: "string", // El id debe ser numérico
          title: "Airline ID",
          hidden: true, // Esconde este campo, ya que el id se selecciona automáticamente
        }),
        defineField({
          name: "name",
          type: "string", // El nombre será una cadena
          title: "Airline Name",
        }),
      ],
      components: {
        input: AirlineSelect, // Aquí asignamos el componente `AirlineSelect` creado antes
      },
    }),

    {
      name: "flightNumberRt1",
      type: "string",
      title: "Vuelo",
      fieldset: "roundTripFlight1",
    },
    {
      name: "stopoverRt1",
      type: "string",
      title: "Escalas",
      fieldset: "roundTripFlight1",
    },
    {
      name: "originDestinationRt2",
      type: "string",
      title: "Origen",
      fieldset: "roundTripFlight2",
    },
    {
      name: "departureDateRt2",
      type: "date",
      title: "Salida",
      fieldset: "roundTripFlight2",
    },
    {
      name: "departureTimeRt2",
      type: "string",
      title: "Hora",
      fieldset: "roundTripFlight2",
    },
    {
      name: "arrivalDestinationRt2",
      type: "string",
      title: "Destino",
      fieldset: "roundTripFlight2",
    },
    {
      name: "arrivalDateRt2",
      type: "date",
      title: "Llegada",
      fieldset: "roundTripFlight2",
    },
    {
      name: "arrivalTimeRt2",
      type: "string",
      title: "Hora",
      fieldset: "roundTripFlight2",
    },
    {
      name: "typeRt2",
      type: "string",
      title: "Tipo de vuelo",
      options: {
        list: [
          {
            title: "Vuelo regular",
            value: "regular",
          },
          {
            title: "Vuelo charter",
            value: "charter",
          },
          {
            title: "Cupos confirmados",
            value: "confirmedSeats",
          },
          {
            title: "Vuelo especial",
            value: "special",
          },
        ],
      },
      fieldset: "roundTripFlight2",
    },
    defineField({
      name: "airlineRt2",
      type: "object",
      title: "Aerolínea",
      fieldset: "roundTripFlight2",
      fields: [
        defineField({
          name: "id",
          type: "string",
          title: "Airline ID",
          hidden: true,
        }),
        defineField({
          name: "name",
          type: "string",
          title: "Airline Name",
        }),
      ],
      components: {
        input: AirlineSelect,
      },
    }),
    {
      name: "flightNumberRt2",
      type: "string",
      title: "Vuelo",
      fieldset: "roundTripFlight2",
    },
    {
      name: "stopoverRt2",
      type: "string",
      title: "Escalas",
      fieldset: "roundTripFlight2",
    },
    defineField({
      name: "hotels",
      title: "Hotels",
      type: "array",
      fieldset: "hotels",
      of: [
        defineField({
          name: "hotel",
          type: "object",
          title: "Hotel",
          fields: [
            defineField({
              name: "id",
              type: "number",
              title: "Hotel ID",
              hidden: true,
            }),
            defineField({
              name: "name",
              type: "string",
              title: "Hotel Name",
            }),
          ],
          components: {
            input: HotelSelect,
          },
        }),
      ],
    }),
    {
      name: "mealPlan",
      type: "string",
      title: "Régimen de comidas",
      fieldset: "hotels",
      options: {
        list: [
          {
            title: "Desayuno",
            id: "breakfast",
            value: "breakfast",
          },
          {
            title: "Media Pensión",
            id: "halfBoard",
            value: "halfBoard",
          },
          {
            title: "Pensión Completa",
            id: "fullBoard",
            value: "fullBoard",
          },
          {
            title: "All Inclusive",
            id: "allInclusive",
            value: "allInclusive",
          },
        ],
      },
    },
    {
      name: "prices",
      type: "array",
      of: [{ type: "price" }],
      fieldset: "prices",
    },
  ],
});
