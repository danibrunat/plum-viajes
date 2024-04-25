import { defineField } from "sanity";

export default defineField({
  type: "object",
  name: "newsletter",
  title: "Boletín de novedades.",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Texto principal",
    },
    {
      name: "subtitle",
      type: "string",
      title: "Texto secundario",
    },
  ],
});
