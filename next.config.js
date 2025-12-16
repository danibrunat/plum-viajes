const path = require("path");

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  workboxOptions: {
    disableDevLogs: true,
    maximumFileSizeToCacheInBytes: 5000000,
  },
});

const nextConfig = {
  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
    root: path.join(__dirname, "."),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "aws-qa1.ola.com.ar" },
      { protocol: "https", hostname: "s3.amazonaws.com" },
      { protocol: "https", hostname: "plumviajes.com.ar" },
      { protocol: "https", hostname: "www.plumviajes.com.ar" },
      { protocol: "https", hostname: "www.afip.gob.ar" },
      { protocol: "http", hostname: "qr.afip.gob.ar" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "guvpgxfgdpcfdtdvrpcd.supabase.co" },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = withPWA(nextConfig);
