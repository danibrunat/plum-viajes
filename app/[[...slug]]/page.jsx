import imageUrlBuilder from "@sanity/image-url";
import React from "react";
import RenderSections from "../components/RenderSections";
import { getData } from "../actions/sanity";
import { client } from "../lib/client";

export async function generateMetadata(props, parent) {
  const params = await props.params;
  const data = await getData(params);

  if (!data) {
    return {
      title: "Landing no encontrada",
      description: "La página solicitada no se encontró.",
      manifest: "/manifest.json",
    };
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
    canonical: config.url && `${config.url}/${slug}`,
    manifest: "/manifest.json",
    openGraph: {
      images: openGraphImages,
    },
    noindex: { disallowRobots },
  };
}

export default async function LandingPage(props) {
  const params = await props.params;
  const data = await getData(params);

  // Verifica si no se obtuvo data o no hay contenido
  if (!data || !data.content || data.content.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Landing no encontrada</h1>
        <p>No se encontró contenido para la página solicitada.</p>
      </div>
    );
  }

  return <RenderSections sections={data.content} />;
}
