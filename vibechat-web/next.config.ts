import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: '.next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Enable compression
  compress: true,
  // Optimize for production
  swcMinify: true,
  // Generate source maps for debugging (remove in production if needed)
  productionBrowserSourceMaps: false,
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/downloads/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
