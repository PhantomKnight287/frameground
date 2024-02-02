import "./env.mjs";
import { withNextJSRouteTypes } from "nextjs-route-types";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/github-avatar/:username",
        destination: "https://github.com/:username.png",
      },
      {
        source: "/imgur/:path*",
        destination: "https://i.imgur.com/:path*",
      },
    ];
  },
};

export default withNextJSRouteTypes(nextConfig);
