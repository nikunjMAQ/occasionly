import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  // Only run service worker in production — dev mode causes Workbox file read errors
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
