import { FaHotel } from "react-icons/fa";
import { defineField } from "sanity";

export default defineField({
  name: "hotel",
  title: "Hotel",
  icon: FaHotel,
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
      name: "images",
      title: "Imagenes",
      type: "array",
      of: [{ type: "image" }],
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
