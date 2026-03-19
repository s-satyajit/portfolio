import type { Metadata } from "next";

import { seoConfig } from "@/data/seo";
import { PageSeoInput } from "@/types/seo";

export function absoluteUrl(pathname = "/"): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(normalized, seoConfig.siteUrl).toString();
}

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const canonical = absoluteUrl(input.path);
  const title = input.title;
  const image = input.image || seoConfig.defaultImage;
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);
  const keywords = input.keywords?.length ? input.keywords : seoConfig.keywords;

  return {
    title,
    description: input.description,
    keywords,
    robots: {
      index: true,
      follow: true
    },
    alternates: {
      canonical
    },
    openGraph: {
      type: input.type || "website",
      title,
      description: input.description,
      url: canonical,
      siteName: seoConfig.siteName,
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      creator: seoConfig.twitterHandle,
      images: [imageUrl]
    }
  };
}
