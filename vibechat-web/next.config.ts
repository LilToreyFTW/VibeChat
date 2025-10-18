import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: '.next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
