import type { MetadataRoute } from "next";

// TODO: swap for the real production domain once the client confirms it
// (see site.ts / README for other pending TODOs). Using a placeholder
// so the site still builds and produces a well-formed sitemap in the
// meantime.
const baseUrl = "https://makaramen.bg";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/restaurant`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/catering`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
