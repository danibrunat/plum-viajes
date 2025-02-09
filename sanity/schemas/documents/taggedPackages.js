import React from "react";

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
  preview: {
    select: {
      title: "title",
      packageId: "packageId",
      nights: "nights",
      price: "price",
      currency: "currency",
      provider: "provider",
      thumbnail: "thumbnail",
    },
    prepare({
      title,
      packageId,
      nights,
      price,
      currency,
      provider,
      thumbnail,
    }) {
      return {
        title: title || "Sin título",
        subtitle: `ID: ${packageId || "N/A"} | Precio: ${
          price ? price + " " + (currency || "") : "No definido"
        } ${nights ? "| " + nights + " noches" : ""} ${
          provider ? "| " + provider : ""
        }`,
        media: thumbnail
          ? React.createElement("img", {
              src: thumbnail,
              alt: title,
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
              },
            })
          : null,
      };
    },
  },
};
