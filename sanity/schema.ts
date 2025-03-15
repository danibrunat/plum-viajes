import { type SchemaTypeDefinition } from "sanity";

// Document types
import page from "./schemas/documents/page";
import cities from "./schemas/documents/cities";
import hotels from "./schemas/documents/hotels";
import route from "./schemas/documents/route";
import siteConfig from "./schemas/documents/siteConfig";
import landing from "./schemas/documents/landing";
import packages from "./schemas/documents/packages";
import quotation from "./schemas/documents/quotation";
import tags from "./schemas/documents/tags";
import taggedPackages from "./schemas/documents/taggedPackages";
import providerPackages from "./schemas/documents/providerPackages";
import airlines from "./schemas/documents/airlines";
import providers from "./schemas/documents/providers";

// Object types
import cta from "./schemas/objects/cta";
import homeLinksBanners from "./schemas/objects/homeLinkBanner";
import imageLink from "./schemas/objects/imageLink";
import embedHTML from "./schemas/objects/embedHTML";
import figure from "./schemas/objects/figure";
import internalLink from "./schemas/objects/internalLink";
import link from "./schemas/objects/link";
import searchEngines from "./schemas/objects/searchEngines";
import portableText from "./schemas/objects/portableText";
import simplePortableText from "./schemas/objects/simplePortableText";
import products from "./schemas/objects/products";
import reviews from "./schemas/objects/reviews";
import newsletter from "./schemas/objects/newsletter";
import iFrame from "./schemas/objects/iframe";
import departure from "./schemas/objects/departure";
import prices from "./schemas/objects/prices";

// Landing page sections
import hero from "./schemas/objects/hero";
import imageSection from "./schemas/objects/imageSection";
import textSection from "./schemas/objects/textSection";
import slider from "./schemas/objects/slider";
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    packages,
    cities,
    hotels,
    airlines,
    providers,
    tags,
    taggedPackages,
    providerPackages,
    quotation,
    cta,
    embedHTML,
    figure,
    hero,
    landing,
    imageSection,
    homeLinksBanners,
    imageLink,
    internalLink,
    searchEngines,
    link,
    reviews,
    products,
    slider,
    page,
    portableText,
    route,
    simplePortableText,
    siteConfig,
    textSection,
    newsletter,
    iFrame,
    departure,
    prices,
  ],
};
