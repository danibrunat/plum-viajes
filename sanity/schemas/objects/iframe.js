import { defineField } from "sanity";

export default defineField({
  type: "object",
  name: "iFrame",
  title: "iFrame",
  description:
    "Porción de otra página que usamos para mostrar una info concreta",
  fields: [
    {
      name: "url",
      type: "string",
      title: "URL",
    },
  ],
  preview: {
    select: {
      url: "url",
    },
    prepare({ url }) {
      return {
        title: `iFrame hacia ${url}`,
      };
    },
  },
});
