import type { Metadata } from "next"

const description = "Create an OpenBuild Dev Card from your public GitHub activity and showcase your builder identity, projects, and contributions across the Web3 community."
const title = "OpenBuild Web3 Developer Identity"
const socialTitle = `${title} | Web3Insight Dev Card`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/openbuild" },
  openGraph: { title: socialTitle, description, url: "/openbuild", type: "website" },
}

export default function OpenBuildLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
