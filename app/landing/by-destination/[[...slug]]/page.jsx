import imageUrlBuilder from "@sanity/image-url";
import groq from "groq";
import { client } from "../../../../sanity/lib/client";
import { sanityFetch } from "../../../../sanity/lib/sanityFetch";
import RenderSections from "../../../components/RenderSections";
import capitalizeString from "../../../../utils/capitalizeString";
import LandingGrid from "./LandingGrid";
import { LandingService } from "../../../services/landing.service";

async function getLandingData(product, destination) {
  const body = {
    destination,
    product,
  };
  const landingData = await LandingService.destination.get(body);
  return landingData;
}

async function getData(params) {
  //console.log("params", params);

  const slug = params?.slug[1];
  const product = params?.slug[0];
  const pageQuery = groq`*[_type == "landing" && destination.current == "${slug}" && product == "${product}"]`;

  const landingData = await sanityFetch({
    query: pageQuery,
  }).then((res) => {
    //console.log("res[0]?", res[0]);
    return res[0] ? { ...res[0], slug } : undefined;
  });

  if (!landingData?._type === "landing") {
    throw new Error("landing not found");
  }
  return landingData;
}

export async function generateMetadata({ params }, parent) {
  const builder = imageUrlBuilder(client);

  const {
    title = "Missing title",
    description,
    disallowRobots,
    openGraphImage,
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

  return {
    title,
    description,
    //canonical: config?.url && `${config?.url}/${slug}`,
    openGraph: {
      images: openGraphImages,
    },
    noindex: { disallowRobots },
  };
}

export default async function Landing({ params }) {
  const { content = [] } = await getData(params);
  const destination = params?.slug[1];
  const product = params?.slug[0];
  const landingData = await getLandingData(product, destination);
  return (
    <main>
      {content && <RenderSections sections={content} />}
      <div className="flex flex-col mx-2 md:mx-12 text-center">
        <h1 className="text-xl">
          {capitalizeString(product)} a {capitalizeString(destination)}{" "}
        </h1>{" "}
        <em className="text-md">Seleccione el destino de su interés</em>
        <LandingGrid product={product} landingData={landingData} />
      </div>
    </main>
  );
}
