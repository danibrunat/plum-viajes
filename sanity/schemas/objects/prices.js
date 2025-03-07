import { defineField } from "sanity";
import { PRICES } from "../../../app/constants/prices";

export default defineField({
  type: "object",
  name: "price",
  title: "Tarifa",
  fields: [
    {
      name: "type",
      type: "string",
      title: "Tipo",
      options: {
        list: PRICES.map((o) => ({
          title: o.label,
          id: o.id,
          value: o.value,
        })),
      },
    },
    {
      name: "amount",
      type: "number",
      title: "Valor",
    },
    {
      name: "currency",
      type: "string",
      title: "Moneda",
      description: "Por el momento, solo con ARS. En desarrollo...",
    },
    {
      name: "taxes",
      type: "number",
      title: "Impuestos",
    },
    {
      name: "paisTax",
      type: "number",
      title: "Impuesto PAIS",
    },
    {
      name: "rg5463",
      type: "number",
      title: "RG 5463",
    },
    {
      name: "iva",
      type: "number",
      title: "IVA",
    },
    {
      name: "other",
      type: "number",
      title: "Otros",
    },
  ],
  preview: {
    select: {
      type: "type",
      amount: "amount",
    },
    prepare({ type, amount }) {
      return {
        title: `${type}: ${amount}`,
      };
    },
  },
});
