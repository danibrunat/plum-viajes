import dynamic from "next/dynamic";

// Importamos las secciones de forma dinámica usando 'dynamic' de Next.js
export const Hero = dynamic(() => import("./Hero"));
export const HeroWithImages = dynamic(() => import("./HeroWithImages"));
export const HomeLinksBanners = dynamic(() => import("./HomeLinksBanners"));
export const TextSection = dynamic(() => import("./TextSection"));
export const ImageSection = dynamic(() => import("./ImageSection"));
export const Slider = dynamic(() => import("./Slider/index.jsx"));
export const SearchEngines = dynamic(() => import("./SearchEngines"));
export const Reviews = dynamic(() => import("./Reviews"));
export const IFrame = dynamic(() => import("./iFrame"));
export const TaggedPackages = dynamic(() => import("./TaggedPackages"));
