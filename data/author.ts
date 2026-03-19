import { profile } from "@/data/profile";
import { socialLinks } from "@/data/social-links";

export const authorProfile = {
  name: profile.name,
  role: profile.title,
  avatar: profile.image,
  shortBio:
    "AI-focused engineer building practical systems across full-stack apps, research-led content, and production-ready integrations.",
  longBio:
    "Satyajit writes about AI engineering, architecture tradeoffs, and practical product implementation. His work connects technical writing with shipped projects and applied systems thinking.",
  aboutUrl: "/about",
  portfolioUrl: "/",
  projectUrl: "/projects",
  caseStudiesUrl: "/case-studies",
  researchUrl: "/research",
  contactUrl: "/contact",
  social: socialLinks
};
