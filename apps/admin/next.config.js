const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/github-avatar/:username",
        destination: "https://github.com/:username.png",
      },
    ];
  },
};

module.exports = nextConfig;
