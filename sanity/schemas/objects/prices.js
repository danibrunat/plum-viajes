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
  ],
  preview: {
    select: {
      type: "type",
      amount: "amount"
    },
    prepare({ type, amount }) {
      return {
        title: `${type}: ${amount}`,
      };
    },
  },
});
