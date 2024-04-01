import imageUrlBuilder from "@sanity/image-url";
import React from "react";
import { client } from "../../sanity/lib/client";
import RenderSections from "../components/RenderSections";
import { getData } from "../actions/sanity";

export async function generateMetadata({ params }, parent) {
  const builder = imageUrlBuilder(client);

  // read route params
  const {
    title = "Missing title",
    description,
    disallowRobots,
    openGraphImage,
    content = [],
    config = {},
    slug,
  } = await getData(params);

  const openGraphImages = openGraphImage
    ? [
        {
          url: builder.image(openGraphImage).width(800).height(600).url(),
          width: 800,
          height: 600,
          alt: title,
        },
        {
          // Facebook recommended size
          url: builder.image(openGraphImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: title,
        },
        {
          // Square 1:1
          url: builder.image(openGraphImage).width(600).height(600).url(),
          width: 600,
          height: 600,
          alt: title,
        },
      ]
    : [];

  // //console.log("title", title);

  return {
    title,
    titleTemplate: `%s | ${config.title}`,
    description,
    canonical: config.url && `${config.url}/${slug}`,
    manifest: "/manifest.json",

    openGraph: {
      images: openGraphImages,
    },
    noindex: { disallowRobots },
  };
}

export default async function LandingPage({ params }) {
  const { content = [] } = await getData(params);

  return content && <RenderSections sections={content} />;
}
