import { defineField } from "sanity";

// with define field
export default defineField({
  name: "airline",
  type: "document",
  title: "Airlines",
  fields: [
    {
      name: "code",
      type: "string",
      title: "Airline Code",
      description: "The unique code of the airline (e.g., IATA code)",
      validation: (Rule) =>
        Rule.required().max(3).error("Code must be 3 characters or less"),
    },
    {
      name: "name",
      type: "string",
      title: "Airline Name",
      description: "The name of the airline",
      validation: (Rule) =>
        Rule.required().min(2).error("Name must be at least 2 characters"),
    },
    {
      name: "logo",
      type: "image",
      title: "Airline Logo",
      description: "The logo of the airline",
      options: {
        hotspot: true,
      },
    },
  ],
});
