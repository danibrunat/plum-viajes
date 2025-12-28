import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from "./env";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

type ImageOptions = {
  width?: number;
  height?: number;
  quality?: number;
};

export const urlForImage = (
  source: SanityImageSource,
  options?: ImageOptions
) => {
  try {
    let builder = imageBuilder.image(source).auto("format");

    if (options?.width) builder = builder.width(options.width);
    if (options?.height) builder = builder.height(options.height);
    if (options?.quality) builder = builder.quality(options.quality);

    return builder.url();
  } catch {
    return "";
  }
};