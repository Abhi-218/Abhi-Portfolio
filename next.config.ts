import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode:true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // For placeholder images
      },
    ],  },
};

export default nextConfig;
