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
    domains: ["cdn.sanity.io", "source.unsplash.com"],
  },
};

module.exports = withPWA(nextConfig);
