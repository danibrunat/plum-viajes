export const sanityImageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  const url = new URL(src);
  url.searchParams.set("w", width.toString());
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  if (quality) url.searchParams.set("q", (quality || 75).toString());
  return url.toString();
};