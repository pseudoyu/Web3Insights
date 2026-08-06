import type { Metadata } from "next"

export const metadata: Metadata = {
  alternates: { canonical: "/monad/create" },
  robots: { index: false, follow: false },
}

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children
}
