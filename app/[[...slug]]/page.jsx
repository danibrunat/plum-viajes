import imageUrlBuilder from "@sanity/image-url";
import React from "react";
import RenderSections from "../components/RenderSections";
import { getData } from "../actions/sanity";
import { client } from "../lib/client";
import { notFound } from "next/navigation";
import { slugToAbsUrl } from "../../utils/urls";

export async function generateMetadata(props, parent) {
  const params = await props.params;
  const data = await getData(params);

  if (!data) {
    // Return 404 metadata to avoid soft-404s without a real 404 status
    notFound();
  }

  const {
    title = "Missing title",
    description,
    disallowRobots,
    openGraphImage,
    content = [],
    config = {},
    slug,
  } = data;

  const builder = imageUrlBuilder(client);

  const openGraphImages = openGraphImage
    ? [
      {
        url: builder.image(openGraphImage).width(800).height(600).url(),
        width: 800,
        height: 600,
        alt: title,
      },
      {
        // Tamaño recomendado para Facebook
        url: builder.image(openGraphImage).width(1200).height(630).url(),
        width: 1200,
        height: 630,
        alt: title,
      },
      {
        // Cuadrado 1:1
        url: builder.image(openGraphImage).width(600).height(600).url(),
        width: 600,
        height: 600,
        alt: title,
      },
    ]
    : [];

  return {
    title,
    titleTemplate: `%s | ${config.title}`,
    description,
    alternates: {
      canonical:
        config.url && slug
          ? slugToAbsUrl(slug, config.url.replace(/\/$/, ""))
          : undefined,
    },
    manifest: "/manifest.json",
    openGraph: {
      images: openGraphImages,
    },
    robots: {
      index: !disallowRobots,
      follow: !disallowRobots,
    },
  };
}

export default async function LandingPage(props) {
  const params = await props.params;
  const data = await getData(params);

  // If there is no data or content, return a real 404 to avoid soft-404s
  if (!data || !data.content || data.content.length === 0) {
    notFound();
  }

  return <RenderSections sections={data.content} />;
}
