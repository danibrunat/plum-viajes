import { defineField } from "sanity";

export default defineField({
  title: "Salida",
  name: "departure",
  type: "object",
  fieldsets: [
    {
      title:
        "Para fechas de salidas específicas, 'Salidas desde' y 'Salidas hasta' deben coincidir",
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
    // Vuelo de ida
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
          { title: "Vuelo regular", value: "regular" },
          { title: "Vuelo charter", value: "charter" },
          { title: "Cupos confirmados", value: "confirmedSeats" },
          { title: "Vuelo especial", value: "special" },
        ],
      },
      fieldset: "roundTripFlight1",
    },
    {
      name: "airlineRt1",
      title: "Aerolínea",
      type: "reference", // Campo de referencia
      to: [{ type: "airline" }], // Referencia al esquema "airline"
      fieldset: "roundTripFlight1",
    },

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
    // Vuelo de vuelta
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
          { title: "Vuelo regular", value: "regular" },
          { title: "Vuelo charter", value: "charter" },
          { title: "Cupos confirmados", value: "confirmedSeats" },
          { title: "Vuelo especial", value: "special" },
        ],
      },
      fieldset: "roundTripFlight2",
    },
    {
      name: "airlineRt2",
      title: "Aerolínea",
      type: "reference", // Tipo de campo de referencia directa
      fieldset: "roundTripFlight2",
      to: [{ type: "airline" }], // Referencia al schema "airline"
    },

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
    // Hoteles
    {
      name: "hotels",
      title: "Hotels",
      type: "array",
      fieldset: "hotels",
      of: [
        {
          type: "reference",
          to: [{ type: "hotel" }], // Aquí defines el tipo de documento al que haces referencia
        },
      ],
    },
    {
      name: "mealPlan",
      type: "string",
      title: "Régimen de comidas",
      fieldset: "hotels",
      options: {
        list: [
          { title: "Desayuno", id: "breakfast", value: "breakfast" },
          { title: "Media Pensión", id: "halfBoard", value: "halfBoard" },
          { title: "Pensión Completa", id: "fullBoard", value: "fullBoard" },
          { title: "All Inclusive", id: "allInclusive", value: "allInclusive" },
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
  preview: {
    select: {
      departureFrom: "departureFrom",
      departureTo: "departureTo",
      departureSeats: "departureSeats",
      departureActive: "departureActive",
      // Vuelo de ida
      flightOrigin1: "originDestinationRt1",
      flightDepartureDate1: "departureDateRt1",
      flightArrival1: "arrivalDestinationRt1",
      flightType1: "typeRt1",
      airline1: "airlineRt1.name",
      flightNumber1: "flightNumberRt1",
      // Vuelo de vuelta
      flightOrigin2: "originDestinationRt2",
      flightDepartureDate2: "departureDateRt2",
      flightArrival2: "arrivalDestinationRt2",
      flightType2: "typeRt2",
      airline2: "airlineRt2.name",
    },
    prepare(selection) {
      const {
        departureFrom,
        departureTo,
        departureSeats,
        departureActive,
        flightOrigin1,
        flightDepartureDate1,
        flightArrival1,
        flightType1,
        airline1,
        flightNumber1,
        flightOrigin2,
        flightDepartureDate2,
        flightArrival2,
        flightType2,
        airline2,
      } = selection;

      const title =
        departureFrom && departureTo
          ? `Salida: ${departureFrom} - ${departureTo}`
          : "Fechas de salida no definidas";

      let flightInfo = "";
      if (flightOrigin1 || flightArrival1) {
        flightInfo = `Ida: ${airline1 ? airline1 + " " : ""}${flightNumber1 || ""} ${flightOrigin1 || ""} → ${flightArrival1 || ""}`;
      }

      let returnInfo = "";
      if (flightOrigin2 || flightArrival2) {
        returnInfo = `Vuelta: ${airline2 ? airline2 + " " : ""}${flightOrigin2 || ""} → ${flightArrival2 || ""}`;
      }

      const seats =
        departureSeats !== undefined ? `Cupos: ${departureSeats}` : "";
      const activeStatus =
        departureActive === 1 ? "Disponible" : "No Disponible";

      let subtitle = `${seats} | ${activeStatus}`;
      if (flightInfo) subtitle += ` | ${flightInfo}`;
      if (returnInfo) subtitle += ` | ${returnInfo}`;

      return {
        title,
        subtitle,
      };
    },
  },
});
