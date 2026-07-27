import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Request body size limits for API routes
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Prevent Next.js from exposing the X-Powered-By header
  poweredByHeader: false,

  // Image optimisation — allow R2 public CDN domain
  images: {
    remotePatterns: process.env.R2_PUBLIC_URL
      ? [
          {
            protocol: 'https',
            hostname: new URL(process.env.R2_PUBLIC_URL).hostname,
          },
        ]
      : [],
  },
};

export default nextConfig;
