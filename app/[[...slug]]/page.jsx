import imageUrlBuilder from "@sanity/image-url";
import groq from "groq";
import React from "react";
import { client } from "../../sanity/lib/client";
import { sanityFetch } from "../../sanity/lib/sanityFetch";
import RenderSections from "../components/RenderSections";
import { getSlugVariations, slugParamToPath } from "../../utils/urls";

/**
 * Fetches data for our pages.
 *
 * The [[...slug]] name for this file is intentional - it means Next will run this getServerSideProps
 * for every page requested - /, /about, /contact, etc..
 * From the received params.slug, we're able to query Sanity for the route coresponding to the currently requested path.
 */
async function getData(params) {
  let data;
  const pageFragment = groq`
...,
content[] {
  ...,
  cta {
    ...,
    route->
  },
  ctas[] {
    ...,
    route->
  }
}`;

  const siteConfigQuery = `
  *[_id == "siteConfig"] {
    ...,
    logo {asset->{extension, url}},
    mainNavigation[] -> {
      ...,
      "title": page->title
    },
    footerNavigation[] -> {
      ...,
      "title": page->title
    }
  }[0]
  `;

  const slug = slugParamToPath(params?.slug);
  console.log("slug", slug);
  const pageQuery = groq`*[_type == "route" && slug.current in $possibleSlugs]{
          page-> {
            ${pageFragment}
          }
        }`;

  const config = await sanityFetch({ query: siteConfigQuery });

  // Frontpage - fetch the linked `frontpage` from the global configuration document.
  if (slug === "/") {
    const frontQuery = groq`
        *[_id == "siteConfig"][0]{
          frontpage -> {
            ${pageFragment}
          }
        }
      `;
    data = await sanityFetch({ query: frontQuery }).then((res) =>
      res?.frontpage ? { ...res.frontpage, slug } : undefined
    );
  } else {
    // Regular route
    data = await sanityFetch({
      query: pageQuery,
      params: { possibleSlugs: getSlugVariations(slug) },
    }).then((res) => {
      return res[0]?.page ? { ...res[0].page, slug } : undefined;
    });
  }

  if (!data?._type === "page") {
    throw new Error("page not found");
  }
  if (data && config) data.config = config;
  console.log("getData | data", JSON.stringify(data));
  return data;
}

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

  console.log("title", title);

  return {
    title,
    titleTemplate: `%s | ${config.title}`,
    description,
    canonical: config.url && `${config.url}/${slug}`,
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
