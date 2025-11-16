import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com", // FB avatar fallback
      },
      {
        protocol: "https",
        hostname: "scontent.xx.fbcdn.net",
      },
    ],
  },
};

export default nextConfig;
