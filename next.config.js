/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-alpha.figma.com",
      },
    ],
  },
};

module.exports = nextConfig;
