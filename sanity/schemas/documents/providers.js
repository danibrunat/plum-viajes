export default {
  name: "provider",
  title: "Proveedores",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "markup",
      title: "Markup %",
      type: "number",
      description: "Porcentaje de mark up para aplicarle a la tarifa final",
      validation: (Rule) => Rule.min(0).max(100),
    },
  ],
};
