/** @type {import('next').NextConfig} */
const nextConfig = {
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
