import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { QueryProvider } from "@/providers/QueryProvider"
import { PrivyProvider } from "@/providers/PrivyProvider"
import { env } from "@/env"
import "./globals.css"

const siteTitle = "Web3 Developer Identity Cards | Web3Insight Dev Card"
const siteDescription = "Create and share a Web3 developer card that turns your public GitHub work, builder identity, and ecosystem contributions into a portable proof of build."

export const metadata: Metadata = {
  metadataBase: new URL("https://card.web3insight.ai"),
  title: {
    default: siteTitle,
    template: "%s | Web3Insight Dev Card",
  },
  description: siteDescription,
  applicationName: "Web3Insight Dev Card",
  manifest: "/site.webmanifest",
  generator: "Web3Insight",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "Web3Insight Dev Card",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Web3Insight Dev Card" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/opengraph-image"],
    creator: "@Web3InsightAI",
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://card.web3insight.ai/#organization",
      name: "Web3Insight",
      url: "https://web3insight.ai",
      logo: "https://card.web3insight.ai/android-chrome-512x512.png",
    },
    {
      "@type": "WebSite",
      "@id": "https://card.web3insight.ai/#website",
      name: "Web3Insight Dev Card",
      url: "https://card.web3insight.ai/",
      publisher: { "@id": "https://card.web3insight.ai/#organization" },
      description: "Public Web3 developer cards built from public GitHub work and ecosystem contributions.",
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        {env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && env.NEXT_PUBLIC_UMAMI_URL && (
          <script
            defer
            src={`${env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
            data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
      </head>
      <body className="antialiased font-sans" style={{ fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <QueryProvider>
          <PrivyProvider>
            {children}
          </PrivyProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
