import { LinkIcon } from "@sanity/icons";
import { defineField } from "sanity";
import { ORIGINS } from "../../../app/constants/origins";
import { OPERATORS } from "../../../app/constants/operators";
import { SPECIAL_OFFER_TAGS } from "../../../app/constants/specialOfferTags";
import { PAYMENT_TYPES } from "../../../app/constants/paymentTypes";
import { CURRENCIES } from "../../../app/constants/currencies";

import CustomDestinationInput from "../../components/Common/CustomDestinationInput";

export default defineField({
  name: "packages",
  type: "document",
  title: "Paquetes Propios",

  icon: LinkIcon,
  fieldsets: [
    {
      title: "Datos descriptivos",
      name: "generalData",
      options: { columns: 2 },
    },
    {
      title: "Ofertas y formas de pago",
      name: "paymentType",
      options: { columns: 2 },
    },
    {
      title: "Posicionamiento en buscadores",
      name: "metadata",
    },
    {
      title: "Información de tarifas",
      name: "pricesInfo",
      options: { columns: 2 },
    },
    {
      title: "Salidas",
      name: "departures",
      //  options: { columns: 2 },
    },
  ],
  fields: [
    {
      name: "title",
      type: "string",
      title: "Título",
      fieldset: "generalData",
    },
    {
      name: "slug",
      type: "slug",
      title: "título en la URL",
      fieldset: "generalData",
      options: {
        //Change to schema title to automatically populate
        source: "title",
        slugify: (input) =>
          input
            .toLowerCase()
            //Remove spaces
            .replace(/\s+/g, "-")
            //Remove special characters
            .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ""),
        validation: (Rule) => Rule.required(),
      },
    },
    {
      name: "subtitle",
      type: "string",
      title: "Subtítulo",
      fieldset: "generalData",
    },
    {
      title: "Origen",
      name: "origin",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "grid",
        list: ORIGINS.map((o) => ({
          title: o.cityName,
          value: o.id,
        })).slice(1, 5),
      },
    },
    {
      name: "destination",
      title: "",
      type: "array",
      of: [{ type: "string" }],
      components: {
        input: CustomDestinationInput,
      },
    },
    /* {
      name: "origin",
      type: "tags",
      title: "Origen",
      fieldset: "generalData",
      description: "Ciudad de origen del paquete",
      options: {
        predefinedTags: ORIGINS.map((o) => ({
          label: o.cityName,
          value: o.cityName,
        })),
      },
    },
    {
      name: "destination",
      type: "tags",
      title: "Destino",
      fieldset: "generalData",
      description: "Ciudad de destino del paquete",
      options: {
        predefinedTags: CITIES.map((o) => ({
          label: o.name,
          value: o.name,
        })),
      },
    }, */
    {
      name: "nights",
      type: "number",
      title: "Noches",
      fieldset: "generalData",
    },
    {
      name: "operator",
      type: "string",
      title: "Operador",
      fieldset: "generalData",

      options: {
        list: OPERATORS.map((o) => ({
          title: o.name,
          id: o.id,
          value: o.name,
        })),
      },
    },
    {
      name: "tags",
      type: "array",
      title: "Tags",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    },
    {
      name: "shortDescription",
      type: "text",
      title: "Descripción Corta",
      fieldset: "generalData",
    },
    {
      name: "longDescription",
      type: "simplePortableText",
      title: "Descripción larga",
      fieldset: "generalData",
    },
    {
      name: "product",
      type: "string",
      description: "Indicá el tipo de producto",
      fieldset: "generalData",

      options: {
        list: [
          { title: "Paquetes", id: "pkg", value: "paquetes" },
          { title: "Aéreo", id: "air", value: "aereo" },
          { title: "Hoteles", id: "htl", value: "hoteles" },
          { title: "Asistencia al Viajero", id: "ins", value: "asistencias" },
          { title: "Cruceros", id: "cru", value: "cruceros" },
          { title: "Autos", id: "car", value: "autos" },
        ],
      },
    },
    {
      title: "Vigencia desde",
      name: "validDateFrom",
      fieldset: "generalData",

      type: "date",
      options: {
        dateFormat: "DD-MM-YYYY",
        calendarTodayLabel: "Hoy",
      },
    },
    {
      title: "Vigencia hasta",
      name: "validDateTo",
      fieldset: "generalData",

      type: "date",
      options: {
        dateFormat: "DD-MM-YYYY",
        calendarTodayLabel: "Hoy",
      },
    },
    {
      name: "labels",
      type: "text",
      fieldset: "generalData",
      title: "Etiquetas",
    },
    {
      name: "cancellationPolicy",
      fieldset: "generalData",

      type: "text",
      fieldset: "generalData",
      title: "Política de cancelación",
    },
    // Tipos de Oferta
    {
      name: "specialOfferTags",
      type: "string",
      title: "Tipo de oferta",
      fieldset: "paymentType",

      options: {
        list: SPECIAL_OFFER_TAGS.map((o) => ({
          title: o.description,
          id: o.id,
          value: o.description,
        })),
      },
    },
    {
      name: "paymentType",
      type: "string",
      title: "Formas de Pago",
      fieldset: "paymentType",
      options: {
        list: PAYMENT_TYPES.map((o) => ({
          title: o.name,
          id: o.id,
          value: o.name,
        })),
      },
    },

    // SEO
    {
      name: "description",
      type: "text",
      title: "Description",
      description: "La descripción por tags de la metadata",
      fieldset: "metadata",
    },
    {
      name: "openGraphImage",
      type: "image",
      title: "Imagen de Open Graph (SEO)",
      description: "Imagen como vista previa para Facebook, Twitter, etc.",
      fieldset: "metadata",
    },

    {
      name: "ageMaxChildren",
      type: "number",
      title: "Edad máxima menores",
      fieldset: "pricesInfo",
    },
    {
      name: "currency",
      type: "string",
      title: "Moneda",
      fieldset: "pricesInfo",
      options: {
        list: CURRENCIES.map((o) => ({
          title: o.description,
          id: o.id,
          value: o.description,
        })),
      },
    },
    {
      name: "images",
      type: "array",
      title: "Imágenes del paquete",
      of: [{ type: "image" }],
    },
    {
      name: "departures",
      type: "array",
      title: "Salidas",
      fieldset: "departures",
      of: [{ type: "departure" }],
    },
    {
      name: "active",
      title: "Activo",
      type: "boolean",
      description:
        "Desactiva esta opción para ocultar el paquete en el frontend",
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      destination: "destination.0", // Muestra el primer destino
      nights: "nights",
      active: "active",
      image: "images.0.asset",
    },
    prepare({ title, subtitle, destination, nights, active, image }) {
      return {
        title: title || "Sin título",
        subtitle: `${subtitle || "Sin subtítulo"} | ${
          destination || "Destino no especificado"
        }`,
        media: image,
        description: `Noches: ${nights || "N/A"} | ${
          active ? "Activo" : "Inactivo"
        }`,
      };
    },
  },
});
