import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteUrl";

const baseUrl = siteUrl;

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
