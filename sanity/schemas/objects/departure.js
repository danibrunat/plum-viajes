import { defineField } from "sanity";
import { AIRLINES } from "../../../app/constants/airlines";

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
      options: { columns: 3 },
    },
    {
      title: "Tarifas",
      name: "prices",
      options: { columns: 6 },
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
    {
      name: "airlineRt1",
      type: "string",
      title: "Aerolínea",
      fieldset: "roundTripFlight1",
      options: {
        list: AIRLINES.map((o) => ({
          title: o.name,
          id: o.id,
          value: o.name,
        })),
      },
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
    {
      name: "airlineRt2",
      type: "string",
      title: "Aerolínea",
      fieldset: "roundTripFlight2",
      options: {
        list: AIRLINES.map((o) => ({
          title: o.name,
          id: o.id,
          value: o.name,
        })),
      },
    },
    {
      name: "stopoverRt2",
      type: "string",
      title: "Escalas",
      fieldset: "roundTripFlight2",
    },
  ],
});
