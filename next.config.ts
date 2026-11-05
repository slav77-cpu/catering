import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const REQUIRED_IN_PRODUCTION = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "CLOUDINARY_UPLOAD_PRESET",
];

const nextConfig: NextConfig = {
  // Its SDK loads modules dynamically, which doesn't survive bundling.
  serverExternalPackages: ["cloudinary"],
  images: {
    remotePatterns: [
      // Our own account only. The host alone would let anyone's Cloudinary upload
      // through this server's image optimizer. (Cloudinary photos normally skip the
      // optimizer via cloudinaryLoader; this covers a plain next/image with such a URL.)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: process.env.CLOUDINARY_CLOUD_NAME ? `/${process.env.CLOUDINARY_CLOUD_NAME}/**` : "/**",
      },
      // Stand-in stock photography (src/lib/stockImages.ts) until real photos replace it.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default function config(phase: string): NextConfig {
  // Fail the build rather than ship a site with no database: the host keeps
  // serving the last good deploy when a build fails. The pipeline's build job
  // has no secrets and only checks that the code compiles, so it opts out.
  if (phase === PHASE_PRODUCTION_BUILD && process.env.GITHUB_ACTIONS !== "true" && !process.env.SKIP_ENV_CHECK) {
    const missing = REQUIRED_IN_PRODUCTION.filter((name) => !process.env[name]);
    if (missing.length > 0) {
      throw new Error(
        `Missing environment variables: ${missing.join(", ")}. See .env.example. ` +
          "Set SKIP_ENV_CHECK=1 to build without them on purpose.",
      );
    }
  }
  return nextConfig;
}
