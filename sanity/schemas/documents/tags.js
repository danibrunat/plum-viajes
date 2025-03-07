import { FaTags } from "react-icons/fa";
import { defineField } from "sanity";

export default defineField({
  name: "tag",
  type: "document",
  icon: FaTags,
  title: "Tags de paquetes",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Tag Name",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "color",
      type: "string",
      title: "Color",
      description: "Color de fondo del tag",
    },
  ],
});
