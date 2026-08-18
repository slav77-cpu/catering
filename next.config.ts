import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Stand-in stock photography (see src/lib/stockImages.ts) is hotlinked
    // from Unsplash until the client's real photos replace it — safe to
    // remove this once no images.unsplash.com URLs remain in the data files.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
