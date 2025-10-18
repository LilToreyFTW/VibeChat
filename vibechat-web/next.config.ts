import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Enable compression and optimization
  compress: true,
  // Disable source maps in production for better performance
  productionBrowserSourceMaps: false,
  // Experimental features for better Vercel compatibility
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  // Headers for better caching and security
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
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  // Redirects for better SEO and user experience
  async redirects() {
    return [
      {
        source: '/web',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
