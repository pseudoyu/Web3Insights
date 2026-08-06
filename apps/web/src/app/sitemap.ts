import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://web3insight.ai/",
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}
