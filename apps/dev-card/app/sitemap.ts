import type { MetadataRoute } from "next"

const BASE_URL = "https://card.web3insight.ai"

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/monad", "/mantle", "/openbuild"].map((path) => ({
    url: `${BASE_URL}${path || "/"}`,
    changeFrequency: "weekly" as const,
  }))
}
