import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import Script from "next/script";
import { LogoJsonLd } from "next-seo";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Whatsapp from "./components/Widgets/Whatsapp";
import ModalRoot from "./components/commons/Modal/ModalRoot";
import SocialWidget from "./components/Widgets/SocialWidget";
import ClientProviders from "./providers/ClientProviders";
import { sanityFetch } from "./lib/sanityFetch";
import { Analytics } from "@vercel/analytics/next"

const GENERAL_MAINTENANCE_MODE = false;

const inter = Inter({ subsets: ["latin"] });
const googleTagId = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://plumviajes.com.ar'),
  title: "Plum Viajes",
  description: "Tu agencia de viajes online",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Plum Viajes",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
        },
        whatsappLink,
        facebookLink,
        instagramLink
        }[0]
        `;

  const config = await sanityFetch({ query: siteConfigQuery });
  ////console.log("config", config);
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
    whatsappLink,
    facebookLink,
    instagramLink,
  } = config;
  const logoUrl = logo && logo.asset && logo.asset.url;

  if (GENERAL_MAINTENANCE_MODE) {
    return (
      <html lang="es">
        <body className={`${inter.className} text-sm md:text-1xl`}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width, viewport-fit=cover"
            />
          </Head>
          <Header title={title} navItems={[]} logo={logo} contact={contact} />
          <main className="flex flex-col justify-start items-center min-h-screen p-16">
            <section className="flex flex-col items-center justify-start border-2 border-plumPrimaryPurple rounded border-solid p-8 bg-white/80 shadow-lg">
              <h1 className="text-2xl font-bold text-plumPrimaryPurple mb-4">
                ¡Nos estamos renovando!
              </h1>
              <p className="text-lg text-gray-700 text-center max-w-xl">
                Estamos trabajando para traerte una nueva experiencia en Plum
                Viajes.
                <br />
                Muy pronto podrás planificar tu próximo viaje con nosotros de
                manera 100% digital.
                <br />
                ¡Gracias por tu paciencia!
              </p>
            </section>
          </main>
          <Footer navItems={footerNavigation} text={footerText} />
          {logoUrl && url && <LogoJsonLd url={url} logo={logoUrl} />}
          <Whatsapp />
          <SocialWidget
            whatsappLink={whatsappLink}
            facebookLink={facebookLink}
            instagramLink={instagramLink}
          />{" "}
          {/* Pasa los enlaces como props */}
        </body>
      </html>
    );
  }
  return (
    <html lang="es">
      <body className={`${inter.className} text-sm md:text-1xl`}>
        {googleTagId && (
          <>
            <Script
              id="gtag-lib"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleTagId}');
              `}
            </Script>
          </>
        )}
        <ClientProviders>
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
          <SocialWidget
            whatsappLink={whatsappLink}
            facebookLink={facebookLink}
            instagramLink={instagramLink}
          />
        </ClientProviders>
        <Analytics />
      </body>
    </html>
  );
}
