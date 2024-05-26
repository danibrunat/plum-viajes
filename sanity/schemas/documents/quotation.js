import { CITIES } from "../../../app/constants/destinations";
import { ThListIcon } from "@sanity/icons";
import { defineField } from "sanity";

export default defineField({
  name: "quotation",
  type: "document",
  title: "Cotizador",
  icon: ThListIcon,
  fields: [
    {
      name: "destination",
      type: "string",
      title: "Destino",
      options: {
        list: CITIES.map((o) => ({
          title: o.name,
          value: o.name,
        })),
      },
    },
    {
      name: "departureDate",
      type: "date",
      options: {
        dateFormat: "DD/MM/YYYY",
      },
      title: "Salida",
    },
  ],
  preview: {
    select: {
      destination: "destination",
      departureDate: "departureDate",
    },
    prepare({ destination, departureDate }) {
      return {
        title: `Cotización: ${destination}`,
        subtitle: `Salida: ${departureDate}`,
      };
    },
  },
});
