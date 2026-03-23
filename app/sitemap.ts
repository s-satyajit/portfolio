import { MetadataRoute } from "next";

import { getProjects } from "@/data/projects";
import { seoConfig } from "@/data/seo";
import { getAllBlogPosts, getAllCaseStudies, getAllResearchEntries } from "@/lib/mdx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = getProjects();

  const [blogPosts, researchEntries, caseStudies] = await Promise.all([
    getAllBlogPosts(true),
    getAllResearchEntries(true),
    getAllCaseStudies(true)
  ]);

  const staticRoutes = [
    "/",
    "/about",
    "/projects",
    "/insights",
    "/experience",
    "/research",
    "/blog",
    "/case-studies",
    "/services",
    "/resume",
    "/contact",
    "/recruiters"
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: new URL(route, seoConfig.siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7
  }));

  projects.forEach((project) => {
    entries.push({
      url: new URL(`/projects/${project.slug}`, seoConfig.siteUrl).toString(),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75
    });
  });

  blogPosts.forEach((post) => {
    entries.push({
      url: new URL(`/blog/${post.slug}`, seoConfig.siteUrl).toString(),
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.74
    });
  });

  researchEntries.forEach((entry) => {
    entries.push({
      url: new URL(`/research/${entry.slug}`, seoConfig.siteUrl).toString(),
      lastModified: new Date(entry.date),
      changeFrequency: "monthly",
      priority: 0.72
    });
  });

  caseStudies.forEach((entry) => {
    entries.push({
      url: new URL(`/case-studies/${entry.slug}`, seoConfig.siteUrl).toString(),
      lastModified: new Date(entry.date),
      changeFrequency: "monthly",
      priority: 0.72
    });
  });

  return entries;
}
