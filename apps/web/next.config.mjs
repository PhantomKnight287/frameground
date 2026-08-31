import "./env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;
