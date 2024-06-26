import { MasterDetailIcon } from "@sanity/icons";
import { defineField } from "sanity";

export default defineField({
  name: "page",
  type: "document",
  title: "Páginas",
  icon: MasterDetailIcon,
  fieldsets: [
    {
      title: "SEO & metadata",
      name: "metadata",
    },
  ],
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "content",
      type: "array",
      title: "Page sections",
      of: [
        { type: "hero" },
        { type: "slider" },
        { type: "homeLinksBanners" },
        { type: "searchEngines" },
        { type: "reviews" },
        { type: "imageSection" },
        { type: "textSection" },
        { type: "iFrame" },
      ],
    },
    {
      name: "description",
      type: "text",
      title: "Description",
      description: "This description populates meta-tags on the webpage",
      fieldset: "metadata",
    },
    {
      name: "openGraphImage",
      type: "image",
      title: "Open Graph Image",
      description: "Image for sharing previews on Facebook, Twitter etc.",
      fieldset: "metadata",
    },
  ],

  preview: {
    select: {
      title: "title",
      media: "openGraphImage",
    },
  },
});
