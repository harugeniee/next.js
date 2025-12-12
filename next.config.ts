import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  env: {
    PORT: process.env.NEXT_PUBLIC_PORT || '3001'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.calumma.cc',
      },
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
      },
      {
        protocol: 'https',
        hostname: 's3.anilist.co',
      },
      {
        protocol: 'https',
        hostname: 's2.anilist.co',
      },
      {
        protocol: 'https',
        hostname: 's1.anilist.co',
      },
      {
        protocol: 'https',
        hostname: 'anilist.co',
      },
    ],
    // Enable image optimization
    unoptimized: false,
    // Add more optimization options
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
