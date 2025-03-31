const { hostname } = require("os");

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
  async headers() {
    return [
      {
        // Headers para CORS en rutas de API
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3333",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Authorization, Content-Type, X-HTTP-Method-Override",
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
