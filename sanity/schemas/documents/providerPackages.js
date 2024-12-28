import ProviderPackages from "../../components/ProviderPackages";

export default {
  name: "providerPackages",
  type: "document",
  title: "Paquetes de Proveedores",
  fields: [
    {
      name: "providerPackage",
      type: "string",
      title: "Buscar Paquetes de Proveedor",
      components: {
        input: ProviderPackages,
      },
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      hidden: ({ document }) => !document?.packages?.length, // Oculta los tags si no hay paquetes
    },
  ],
};
