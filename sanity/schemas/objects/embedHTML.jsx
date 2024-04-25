import React from "react";
import { defineField } from "sanity";

const HTMLpreview = ({ value }) => (
  // eslint-disable-next-line
  <div dangerouslySetInnerHTML={{ __html: value.html }} />
);

export default defineField({
  name: "embedHTML",
  title: "Embed HTML",
  type: "object",
  fields: [
    {
      name: "html",
      title: "HTML",
      type: "text",
      description:
        "You usually want to avoid storing freeform HTML, but for embed codes it can be useful.",
      options: {
        language: "html",
      },
    },
  ],
  components: {
    preview: HTMLpreview,
  },
  preview: {
    select: {
      html: "html",
    },
  },
});
