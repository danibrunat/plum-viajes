export default {
  name: "tag",
  type: "document",
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
};
