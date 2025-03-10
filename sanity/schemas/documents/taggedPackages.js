import { FaTag } from "react-icons/fa";
import { defineField } from "sanity";

export default defineField({
  name: "taggedPackages",
  type: "document",
  icon: FaTag,
  description:
    "Un listado de paquetes de proveedores que tienen tags. Desde acá se puede modificar datos relevantes como el precio y otras cuestiones para tener siempre la información fresca.",
  title: "Paquetes de Proveedores Taggeados",
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
      name: "destination",
      title: "Destinos",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "city" }], // Aquí defines el tipo de documento al que haces referencia
        },
      ],
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
    {
      name: "departureId",
      type: "string",
      title: "Departure Id (uso interno)",
      description: "Este campo no debe ser modificado",
    },
  ],
});
