import { defineField } from "sanity";

export default defineField({
  name: "slider",
  type: "object",
  title: "Slider de imágenes",
  fields: [
    {
      name: "items",
      type: "array",
      title: "Imágenes",
      of: [
        {
          name: "image",
          type: "image",
          title: "Image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
          ],
        },
      ],
      options: {
        layout: "grid",
      },
    },
    {
      name: "display",
      type: "string",
      title: "Display as",
      description: "How should we display these images?",
      options: {
        list: [{ title: "Carousel", value: "carousel" }],
        layout: "radio", // <-- defaults to 'dropdown'
      },
    },
    {
      name: "zoom",
      type: "boolean",
      title: "Zoom enabled",
      description: "Should we enable zooming of images?",
    },
  ],
  /* preview: {
    select: {
      images: "images",
      image: "images.0",
    },
    prepare(selection) {
      const { images, image } = selection;

      return {
        title: `Gallery block of ${Object.keys(images).length} images`,
        subtitle: `Alt text: ${image.alt}`,
        media: image,
      };
    },
  }, */
});
