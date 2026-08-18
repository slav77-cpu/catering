import type { MetadataRoute } from "next";

// TODO: swap for the real production domain once the client confirms it
// (kept in sync with the same placeholder in sitemap.ts).
const baseUrl = "https://makaramen.bg";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
