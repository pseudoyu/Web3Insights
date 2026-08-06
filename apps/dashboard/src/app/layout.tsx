import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Host_Grotesk,
  JetBrains_Mono,
  Caveat,
} from "next/font/google";

import { env } from "@env";
import { getTitle } from "@/utils/app";
import { ClientProviders } from "./providers";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  axes: ["opsz"],
});

const host = Host_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-host",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

// Caveat powers the Blueprint <HandLabel> script callouts. Used sparingly.
const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700"],
  variable: "--font-caveat",
});

const title = getTitle();
const siteTitle = "Web3 Developer & Ecosystem Analytics | Web3Insight";
const description =
  "Explore transparent Web3 ecosystem, repository, developer, and event analytics built from public contribution, activity, and growth signals.";
const siteUrl = "https://dash.web3insight.ai";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0D0D" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${title}`,
  },
  description,
  applicationName: title,
  metadataBase: new URL(siteUrl),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  openGraph: {
    type: "website",
    siteName: title,
    title: siteTitle,
    description,
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = `${bricolage.variable} ${host.variable} ${jetbrains.variable} ${caveat.variable}`;
  const structuredData = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: title,
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: title,
      url: siteUrl,
      description,
      publisher: { "@type": "Organization", name: title },
    },
  ]).replace(/</g, "\\u003c");

  return (
    <html lang="en" suppressHydrationWarning className={fontVars}>
      <head>
        {env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <script
            defer
            src="https://umami.web3insight.ai/script.js"
            data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
      </head>
      <body className="font-sans bg-bg text-fg">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
