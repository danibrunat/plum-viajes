import { type SchemaTypeDefinition } from "sanity";

// Document types
import page from "./schemas/documents/page";
import route from "./schemas/documents/route";
import siteConfig from "./schemas/documents/siteConfig";
import landing from "./schemas/documents/landing";

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

// Landing page sections
import hero from "./schemas/objects/hero";
import imageSection from "./schemas/objects/imageSection";
import mailchimp from "./schemas/objects/mailchimp";
import textSection from "./schemas/objects/textSection";
import heroWithImages from "./schemas/objects/heroWithImages";
import slider from "./schemas/objects/slider";
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    heroWithImages,
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
    mailchimp,
    products,
    slider,
    page,
    portableText,
    route,
    simplePortableText,
    siteConfig,
    textSection,
    newsletter,
  ],
};
