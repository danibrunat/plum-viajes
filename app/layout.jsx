import { Inter } from "next/font/google";
import "./globals.css";
import { sanityFetch } from "@/sanity/lib/sanityFetch";
import Head from "next/head";
import { LogoJsonLd } from "next-seo";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Whatsapp from "./components/Whatsapp";
import ModalRoot from "./components/commons/Modal/ModalRoot";

const inter = Inter({ subsets: ["latin"] });

export default async function Layout({ children }) {
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

  const config = await sanityFetch({ query: siteConfigQuery });
  console.log("config", config);
  if (!config) {
    console.error(
      "Missing site config. Please refer to Sanity and setup your own site configuration"
    );
    return (
      <div>
        Missing site config. Please refer to Sanity and setup your own site
        configuration
      </div>
    );
  }

  const {
    title,
    mainNavigation,
    footerNavigation,
    footerText,
    logo,
    url,
    contact,
  } = config;
  const logoUrl = logo && logo.asset && logo.asset.url;

  return (
    <html lang="en">
      <body className={`${inter.className} text-sm md:text-1xl`}>
        <ModalRoot />
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width, viewport-fit=cover"
          />
        </Head>
        <Header
          title={title}
          navItems={mainNavigation}
          logo={logo}
          contact={contact}
        />
        <div className="content ">{children}</div>
        <Footer navItems={footerNavigation} text={footerText} />
        {logoUrl && url && <LogoJsonLd url={url} logo={logoUrl} />}
        <Whatsapp />
      </body>
    </html>
  );
}
