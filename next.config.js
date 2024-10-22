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
    ],
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
};

module.exports = withPWA(nextConfig);
