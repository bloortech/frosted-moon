import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos Nikita uploads live in Vercel Blob; allow next/image to optimise them.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
