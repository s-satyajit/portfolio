import { profile } from "@/data/profile";
import { seoConfig } from "@/data/seo";
import { sameAsLinks } from "@/data/social-links";
import { absoluteUrl } from "@/lib/seo";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: seoConfig.siteUrl,
    image: absoluteUrl(profile.image),
    jobTitle: profile.title,
    description: profile.bio,
    sameAs: sameAsLinks,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressLocality: "Chandigarh"
    },
    knowsAbout: [
      "Artificial Intelligence",
      "Full-Stack Development",
      "Next.js",
      "Node.js",
      "LLM Integration",
      "Technical Writing"
    ],
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Chandigarh University"
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Biju Pattanaik University of Technology"
      }
    ]
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${seoConfig.siteUrl}/blog?query={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function profilePageSchema(path: string, title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl(path),
    name: title,
    description,
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      url: seoConfig.siteUrl
    }
  };
}

export function articleSchema(input: {
  path: string;
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  keywords?: string[];
  articleBody?: string;
  image?: string;
  type?: "BlogPosting" | "Article";
}) {
  return {
    "@context": "https://schema.org",
    "@type": input.type || "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedTime,
    dateModified: input.modifiedTime || input.publishedTime,
    keywords: input.keywords,
    author: {
      "@type": "Person",
      name: profile.name,
      url: seoConfig.siteUrl
    },
    publisher: {
      "@type": "Organization",
      name: seoConfig.siteName,
      url: seoConfig.siteUrl
    },
    articleBody: input.articleBody,
    mainEntityOfPage: absoluteUrl(input.path),
    image: input.image ? absoluteUrl(input.image) : absoluteUrl(seoConfig.defaultImage)
  };
}

export function breadcrumbSchema(
  entries: Array<{
    name: string;
    path: string;
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path)
    }))
  };
}
