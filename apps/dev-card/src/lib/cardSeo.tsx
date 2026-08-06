import type { Metadata } from "next"
import { cache } from "react"
import { createBackendClient } from "@/orpc/backend"

const BASE_URL = "https://card.web3insight.ai"

type Ecosystem = "monad" | "mantle" | "openbuild"

interface PublicCardUser {
  user_nick_name?: string | null
  user_avatar?: string | null
  user_bio?: string | null
  user_title?: string | null
}

export const getPublicCardUser = cache(async (ecosystem: Ecosystem, userId: string): Promise<PublicCardUser | null> => {
  try {
    const { client } = createBackendClient(null)
    const user = await client.auth.getUserByTagAndId({
      tag: ecosystem,
      id: userId,
    })
    return {
      user_nick_name: user.user_nick_name,
      user_avatar: user.user_avatar,
      user_bio: user.user_bio,
      user_title: user.user_title,
    }
  } catch {
    return null
  }
})

function truncate(value: string, length: number) {
  return value.length > length ? `${value.slice(0, length - 3)}...` : value
}

export async function createCardMetadata(ecosystem: Ecosystem, label: string, userId: string): Promise<Metadata> {
  const encodedUserId = encodeURIComponent(userId)
  const canonical = `${BASE_URL}/${ecosystem}/${encodedUserId}`
  const user = await getPublicCardUser(ecosystem, userId)

  if (!user) {
    return {
      title: "Card not found",
      alternates: { canonical },
      robots: { index: false, follow: false },
      openGraph: { url: canonical },
    }
  }

  const name = user.user_nick_name || "Anonymous Builder"
  const title = `${name}'s ${label} Dev Card`
  const profileSummary = `Explore ${name}'s ${label} Dev Card, public builder identity, Web3 projects, GitHub activity, and ecosystem contributions — a portable proof of build.`
  const description = truncate(
    user.user_bio
      ? `${name} — ${user.user_bio} Explore their ${label} Dev Card, Web3 projects, GitHub activity, and ecosystem contributions.`
      : profileSummary,
    160
  )
  const image = `${BASE_URL}/api/og/${ecosystem}/${encodedUserId}`

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Web3Insight Dev Card",
      type: "profile",
      images: [{ url: image, width: 1200, height: 630, alt: `${name}'s ${label} Dev Card` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@Web3InsightAI",
    },
  }
}

export async function CardSeoContent({ ecosystem, label, userId }: { ecosystem: Ecosystem; label: string; userId: string }) {
  const user = await getPublicCardUser(ecosystem, userId)
  if (!user) return null

  const name = user.user_nick_name || "Anonymous Builder"
  const url = `${BASE_URL}/${ecosystem}/${encodeURIComponent(userId)}`
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profile-page`,
    url,
    name: `${name}'s ${label} Dev Card`,
    mainEntity: {
      "@type": "Person",
      name,
      ...(user.user_bio && { description: user.user_bio }),
      ...(user.user_avatar && { image: user.user_avatar }),
      ...(user.user_title && { jobTitle: user.user_title }),
    },
  }

  return (
    <>
      <h1 className="sr-only">{name}&apos;s {label} Dev Card</h1>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
    </>
  )
}
