const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggresiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
    maximumFileSizeToCacheInBytes: 5000000, // <---- increasing the file size to cached 5mb
  },
});
const nextConfig = {
  images: {
    domains: [
      "cdn.sanity.io",
      "source.unsplash.com",
      "aws-qa1.ola.com.ar",
      "s3.amazonaws.com",
      "plumviajes.com.ar",
      "www.plumviajes.com.ar",
      "guvpgxfgdpcfdtdvrpcd.supabase.co",
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    turbo: {
      resolveExtensions: [
        ".mdx",
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".mjs",
        ".json",
      ],
    },
  },
  async headers() {
    return [
      {
        // Aplicar los headers de CORS a todas las rutas de API
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3333", // Cambia al dominio que permita hacer peticiones
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
