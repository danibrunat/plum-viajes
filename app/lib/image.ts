import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from "./env";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (source: SanityImageSource) => {
  try {
    const imageUrl = imageBuilder
      ?.image(source)
      .auto("format")
      .fit("max")
      .url();
    return imageUrl;
  } catch (error) {
    return source;
  }
};
