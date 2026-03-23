import { SeoConfig } from "@/types/seo";

export const seoConfig: SeoConfig = {
  siteName: "Satyajit Samal",
  siteUrl: process.env.SITE_URL || "https://www.satyajitsamal.vercel.app",
  defaultTitle: "Satyajit Samal - AI Engineer + Full-Stack Developer",
  titleTemplate: "%s | Satyajit Samal",
  defaultDescription:
    "Official portfolio of Satyajit Samal. AI-focused engineer with full-stack foundations building practical products, research-driven systems, and production-minded web experiences.",
  defaultImage: "/og?title=Satyajit%20Samal",
  twitterHandle: "@satyajitstwt",
  keywords: [
    "Satyajit Samal",
    "AI Engineer",
    "Full-Stack Developer",
    "Next.js Portfolio",
    "Gemini Integration",
    "Applied AI",
    "Chandigarh University",
    "ME Artificial Intelligence"
  ]
};
