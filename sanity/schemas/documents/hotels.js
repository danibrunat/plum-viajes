import { defineField } from "sanity";

export default defineField({
  name: "hotel",
  title: "Hotel",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "stars",
      title: "Stars",
      type: "number",
    },
    {
      name: "city_id",
      title: "City",
      type: "reference",
      to: [{ type: "city" }],
      description: "Reference to the city based on its IATA code",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "latitude",
      title: "Latitude",
      type: "number",
    },
    {
      name: "longitude",
      title: "Longitude",
      type: "number",
    },
    {
      name: "plum_id",
      title: "Plum ID",
      type: "string",
    },
  ],
});
