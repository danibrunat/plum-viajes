const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggresiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io", "source.unsplash.com"],
  },
};

module.exports = withPWA(nextConfig);
