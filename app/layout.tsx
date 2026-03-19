import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { SiteShell } from "@/components/layout/site-shell";
import { SchemaScript } from "@/components/ui/schema-script";
import { seoConfig } from "@/data/seo";
import { personSchema, websiteSchema } from "@/lib/schema";
import "@/app/globals.css";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap"
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate
  },
  description: seoConfig.defaultDescription,
  keywords: seoConfig.keywords,
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: seoConfig.siteUrl
  },
  openGraph: {
    type: "website",
    siteName: seoConfig.siteName,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    url: seoConfig.siteUrl
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    creator: seoConfig.twitterHandle
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#070b13",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
        <SchemaScript schema={[personSchema(), websiteSchema()]} />
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
