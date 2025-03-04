import { defineField } from "sanity";

export default defineField({
  name: "city",
  title: "City",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "text", // Using "text" for longer strings
    },
    {
      name: "country_name",
      title: "Country Name",
      type: "string",
    },
    {
      name: "region_name",
      title: "Region Name",
      type: "string",
    },
    {
      name: "iata_code",
      title: "IATA Code",
      type: "string",
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    },
  ],
});
