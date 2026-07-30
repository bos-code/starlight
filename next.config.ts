import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.ingco.com",
        pathname: "/userfiles/**",
      },
      {
        protocol: "https",
        hostname: "www.ingco.com",
        pathname: "/website-center/upload/images/**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/736x/**",
      },
    ],
  },
};

export default nextConfig;
