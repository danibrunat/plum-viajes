export default {
  name: "taggedPackages",
  type: "document",
  title: "Tagged Packages",
  fields: [
    {
      name: "packageId",
      type: "string",
      title: "Package ID",
    },
    {
      name: "title",
      type: "string",
      title: "Package Title",
    },
    {
      name: "nights",
      type: "number",
      title: "Noches",
    },
    {
      name: "price",
      type: "number",
      title: "Precio",
    },
    {
      name: "currency",
      type: "string",
      title: "Moneda",
    },
    {
      name: "productType",
      type: "string",
      title: "Tipo de producto",
    },
    {
      name: "provider",
      type: "string",
      title: "Provider",
    },
    {
      name: "thumbnail",
      type: "string",
      title: "Miniatura",
    },
    {
      name: "tags",
      type: "array",
      title: "Tags",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
  ],
};
