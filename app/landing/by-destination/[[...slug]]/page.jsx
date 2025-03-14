import imageUrlBuilder from "@sanity/image-url";
import groq from "groq";
import { client } from "../../../../sanity/lib/client";
import { sanityFetch } from "../../../../sanity/lib/sanityFetch";
import RenderSections from "../../../components/RenderSections";
import capitalizeString from "../../../../utils/capitalizeString";
import LandingGrid from "./LandingGrid";
import { LandingService } from "../../../services/landing.service";

async function getLandingData(product, destination) {
  const body = { destination, product };
  try {
    const landingData = await LandingService.destination.get(body);
    return landingData;
  } catch (error) {
    console.error("Error fetching landing data:", error);
    throw new Error("Failed to fetch landing data");
  }
}

async function getData(params) {
  const slug = params?.slug[1];
  const product = params?.slug[0];
  const pageQuery = groq`*[_type == "landing" && destination.current == "${slug}" && product == "${product}"]`;

  try {
    const landingData = await sanityFetch({ query: pageQuery }).then((res) => {
      return res[0] ? { ...res[0], slug } : undefined;
    });

    if (!landingData || landingData._type !== "landing") {
      throw new Error("Landing not found");
    }
    return landingData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
}

export async function generateMetadata({ params }, parent) {
  const builder = imageUrlBuilder(client);

  try {
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
            url: builder.image(openGraphImage).width(1200).height(630).url(),
            width: 1200,
            height: 630,
            alt: title,
          },
          {
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
      openGraph: { images: openGraphImages },
      noindex: disallowRobots,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "Failed to generate metadata",
    };
  }
}

export default async function Landing({ params }) {
  try {
    const { content = [] } = await getData(params);
    const destination = params?.slug[1];
    const product = params?.slug[0];
    const landingName =
      product === "packages" ? "Paquetes" : capitalizeString(product);
    const landingData = await getLandingData(product, destination);

    return (
      <main>
        {content && <RenderSections sections={content} />}
        <div className="flex flex-col mx-2 md:mx-12 text-center">
          <h1 className="text-xl">
            {landingName} a {capitalizeString(destination)}{" "}
          </h1>{" "}
          <em className="text-md">Seleccione el destino de su interés</em>
          <LandingGrid product={product} landingData={landingData} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error rendering landing page:", error);
    return <div>Error loading landing page</div>;
  }
}
