import type { Metadata } from "next"
import { CampaignBanner } from "@/components/CampaignBanner"

const description = "Create a Mantle Dev Card from your public GitHub activity and showcase your builder identity, projects, and contributions across the Mantle ecosystem."
const title = "Mantle Web3 Developer Identity"
const socialTitle = `${title} | Web3Insight Dev Card`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/mantle" },
  openGraph: { title: socialTitle, description, url: "/mantle", type: "website" },
}

export default function MantleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CampaignBanner ecosystem="mantle" />
      {children}
    </>
  )
}
