import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dash.web3insight.ai";

  return [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/ecosystems`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/repositories`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/developers`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/report`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/plaza/x402`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
