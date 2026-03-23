import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

import { Project } from "@/types/project";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

const projectFrontmatterSchema = z.object({
  slug: z.string().optional(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  problem: z.string(),
  solution: z.string(),
  features: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  architecture: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  links: z
    .object({
      github: z.string().optional(),
      live: z.string().optional(),
      caseStudy: z.string().optional()
    })
    .default({}),
  featured: z.boolean().default(false),
  showOnHomepage: z.boolean().optional().default(false),
  hasCaseStudy: z.boolean().optional(),
  category: z.enum(["ai", "full-stack", "frontend", "backend", "tooling"]),
  status: z.enum(["live", "in-progress", "archived"]),
  outcomes: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  lessonsLearned: z.array(z.string()).default([]),
  order: z.number().int().optional().default(999),
  draft: z.boolean().optional().default(false),
  laptopImage: z.string().optional(),
  mobileImage: z.string().optional(),
  mockupAlt: z.string().optional(),
  mockupCaption: z.string().optional(),
  mockupMobileSide: z.enum(["left", "right"]).optional(),
  mockupTitle: z.string().optional()
});

function slugFromFileName(fileName: string): string {
  return fileName.replace(/\.mdx$/, "");
}

function resolvePublicAssetPath(publicPath: string): string | undefined {
  if (!publicPath.startsWith("/")) return undefined;
  const normalized = publicPath.replace(/^\/+/, "").split("?")[0];
  return path.join(process.cwd(), "public", normalized);
}

function assetExists(publicPath: string): boolean {
  const fullPath = resolvePublicAssetPath(publicPath);
  return fullPath ? fs.existsSync(fullPath) : false;
}

function withAssetMtimeVersion(publicPath: string): string {
  const fullPath = resolvePublicAssetPath(publicPath);
  if (!fullPath || !fs.existsSync(fullPath)) return publicPath;
  const mtimeMs = Math.floor(fs.statSync(fullPath).mtimeMs);
  const separator = publicPath.includes("?") ? "&" : "?";
  return `${publicPath}${separator}v=${mtimeMs}`;
}

function resolveVersionedAsset(publicPath?: string): string | undefined {
  if (!publicPath) return undefined;
  if (!assetExists(publicPath)) return undefined;
  return withAssetMtimeVersion(publicPath);
}

function resolveSingleProjectImage(slug: string): string | undefined {
  const candidates = [".png", ".jpg", ".jpeg", ".webp", ".avif"].map(
    (ext) => `/images/projects/${slug}${ext}`
  );
  const matched = candidates.find((candidate) => assetExists(candidate));
  return matched ? withAssetMtimeVersion(matched) : undefined;
}

function resolveMockupPaths(
  slug: string,
  frontmatter: z.infer<typeof projectFrontmatterSchema>
) {
  const autoLaptop = `/images/projects/${slug}/laptop.png`;
  const autoMobile = `/images/projects/${slug}/mobile.png`;
  const explicitLaptop = resolveVersionedAsset(frontmatter.laptopImage);
  const explicitMobile = resolveVersionedAsset(frontmatter.mobileImage);
  const fallbackImage =
    frontmatter.images.map((imagePath) => resolveVersionedAsset(imagePath)).find((imagePath) => Boolean(imagePath)) ||
    resolveSingleProjectImage(slug);

  const laptopImage = explicitLaptop || resolveVersionedAsset(autoLaptop) || fallbackImage;
  const mobileImage = explicitMobile || resolveVersionedAsset(autoMobile);

  return {
    laptopImage,
    mobileImage,
    fallbackImage
  };
}

function resolveProjectImages(
  slug: string,
  frontmatter: z.infer<typeof projectFrontmatterSchema>,
  fallbackImage?: string
): string[] {
  const uploadedImages = frontmatter.images
    .map((imagePath) => resolveVersionedAsset(imagePath))
    .filter((imagePath): imagePath is string => Boolean(imagePath));
  if (uploadedImages.length > 0) return uploadedImages;
  if (fallbackImage) return [fallbackImage];

  const autoSingle = resolveSingleProjectImage(slug);
  if (autoSingle) return [autoSingle];

  return [];
}

function loadProjectsFromMdx(): Project[] {
  const files = fs.readdirSync(PROJECTS_DIR).filter((file) => file.endsWith(".mdx"));

  const parsed = files
    .map((fileName) => {
      const filePath = path.join(PROJECTS_DIR, fileName);
      const file = fs.readFileSync(filePath, "utf8");
      const { data } = matter(file);
      const frontmatter = projectFrontmatterSchema.parse(data);
      const slug = frontmatter.slug || slugFromFileName(fileName);
      const { laptopImage, mobileImage, fallbackImage } = resolveMockupPaths(slug, frontmatter);
      const hasCaseStudy = frontmatter.hasCaseStudy ?? Boolean(frontmatter.links.caseStudy);
      const images = resolveProjectImages(slug, frontmatter, fallbackImage);

      const project: Project = {
        slug,
        title: frontmatter.title,
        summary: frontmatter.summary,
        description: frontmatter.description,
        problem: frontmatter.problem,
        solution: frontmatter.solution,
        features: frontmatter.features,
        techStack: frontmatter.techStack,
        architecture: frontmatter.architecture,
        images,
        links: frontmatter.links,
        featured: frontmatter.featured,
        showOnHomepage: frontmatter.showOnHomepage,
        hasCaseStudy,
        category: frontmatter.category,
        status: frontmatter.status,
        outcomes: frontmatter.outcomes,
        lessonsLearned: frontmatter.lessonsLearned,
        laptopImage,
        mobileImage,
        mockupAlt: frontmatter.mockupAlt,
        mockupCaption: frontmatter.mockupCaption,
        mockupMobileSide: frontmatter.mockupMobileSide,
        mockupTitle: frontmatter.mockupTitle,
        order: frontmatter.order,
        draft: frontmatter.draft
      };

      return project;
    })
    .filter((project) => !project.draft)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));

  return parsed;
}

export function getProjects(): Project[] {
  return loadProjectsFromMdx();
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.featured);
}

export function getHomepageProjects(): Project[] {
  return getProjects().filter((project) => project.showOnHomepage);
}
