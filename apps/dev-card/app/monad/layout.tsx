import type { Metadata } from "next"

const description = "Create a Monad Dev Card from your public GitHub activity and showcase your builder identity, projects, and contributions across the Monad ecosystem."
const title = "Monad Web3 Developer Identity"
const socialTitle = `${title} | Web3Insight Dev Card`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/monad" },
  openGraph: { title: socialTitle, description, url: "/monad", type: "website" },
}

export default function MonadLayout({ children }: { children: React.ReactNode }) {
  return children
}
