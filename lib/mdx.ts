import matter from "gray-matter";
import type { MDXComponents } from "mdx/types";
import { compileMDX } from "next-mdx-remote/rsc";
import fs from "node:fs/promises";
import path from "node:path";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { z } from "zod";

import { mdxComponents } from "@/components/mdx/mdx-components";
import { BlogFrontmatter, BlogHeading, BlogPost } from "@/types/blog";
import { CaseStudyEntry, CaseStudyFrontmatter } from "@/types/case-study";
import { ProjectContentEntry, ProjectContentFrontmatter } from "@/types/project-content";
import { ResearchEntry, ResearchFrontmatter } from "@/types/research";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const dateStringSchema = z.preprocess((value) => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}, z.string());
const mockupFields = {
  laptopImage: z.string().optional(),
  mobileImage: z.string().optional(),
  mockupAlt: z.string().optional(),
  mockupCaption: z.string().optional(),
  mockupMobileSide: z.enum(["left", "right"]).optional()
};

const blogSchema = z.object({
  slug: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  excerpt: z.string(),
  date: dateStringSchema,
  updated: dateStringSchema.optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  audience: z.enum(["recruiter", "engineer", "client", "general"]).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  readTime: z.string().optional(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  featured: z.boolean().optional().default(false),
  featuredRank: z.number().int().positive().optional(),
  projectMentions: z.array(z.string()).optional().default([]),
  draft: z.boolean().optional().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ...mockupFields
});

const researchSchema = z.object({
  slug: z.string().optional(),
  title: z.string(),
  status: z.enum([
    "published",
    "accepted",
    "under-review",
    "preprint",
    "in-preparation"
  ]),
  summary: z.string(),
  abstract: z.string(),
  contribution: z.string(),
  venue: z.string(),
  date: dateStringSchema,
  tags: z.array(z.string()).default([]),
  links: z
    .object({
      pdf: z.string().optional(),
      doi: z.string().optional(),
      external: z.string().optional()
    })
    .optional(),
  draft: z.boolean().optional().default(false),
  ...mockupFields
});

const caseStudySchema = z.object({
  slug: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  overview: z.string().optional(),
  focusArea: z.string().optional(),
  context: z.string(),
  problem: z.string(),
  approach: z.string().optional(),
  analysis: z.string(),
  conclusion: z.string(),
  nextIteration: z.array(z.string()).optional().default([]),
  toolsOrMethods: z.array(z.string()).optional().default([]),
  pdf: z.string().optional(),
  pdfReferences: z
    .array(
      z.object({
        label: z.string(),
        href: z.string()
      })
    )
    .optional()
    .default([]),
  keyInsights: z.array(z.string()).default([]),
  learnings: z.array(z.string()).default([]),
  featured: z.boolean().optional().default(false),
  coverImage: z.string().optional(),
  date: dateStringSchema,
  tags: z.array(z.string()).default([]),
  draft: z.boolean().optional().default(false),
  ...mockupFields
});

const projectContentSchema = z.object({
  slug: z.string().optional(),
  title: z.string().optional(),
  mockupTitle: z.string().optional(),
  draft: z.boolean().optional().default(false),
  ...mockupFields
});

function getDirectory(collection: "blog" | "research" | "case-studies" | "projects"): string {
  return path.join(CONTENT_ROOT, collection);
}

async function getCollectionFileNames(
  collection: "blog" | "research" | "case-studies" | "projects"
): Promise<string[]> {
  const directory = getDirectory(collection);
  const files = await fs.readdir(directory);
  return files.filter((file) => file.endsWith(".mdx"));
}

function slugFromFileName(fileName: string): string {
  return fileName.replace(/\.mdx$/, "");
}

async function readMdxFile(
  collection: "blog" | "research" | "case-studies" | "projects",
  slug: string
) {
  const filePath = path.join(getDirectory(collection), `${slug}.mdx`);
  const file = await fs.readFile(filePath, "utf8");
  return matter(file);
}

function sortByDateDescending<T extends { date: string }>(items: T[]): T[] {
  return items.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getAllBlogPosts(includeDraft = false): Promise<BlogFrontmatter[]> {
  const fileNames = await getCollectionFileNames("blog");
  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = slugFromFileName(fileName);
      const file = await readMdxFile("blog", slug);
      const parsed = blogSchema.parse(file.data);
      const readEstimate = parsed.readTime || readingTime(file.content).text;
      return {
        ...parsed,
        slug: parsed.slug || slug,
        readTime: readEstimate
      } satisfies BlogFrontmatter;
    })
  );
  return sortByDateDescending(
    posts.filter((item) => (includeDraft ? true : !item.draft))
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const file = await readMdxFile("blog", slug);
    const parsed = blogSchema.parse(file.data);
    return {
      ...parsed,
      slug: parsed.slug || slug,
      readTime: parsed.readTime || readingTime(file.content).text,
      content: file.content
    };
  } catch {
    return null;
  }
}

export async function getAllResearchEntries(
  includeDraft = false
): Promise<ResearchFrontmatter[]> {
  const fileNames = await getCollectionFileNames("research");
  const entries = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = slugFromFileName(fileName);
      const file = await readMdxFile("research", slug);
      const parsed = researchSchema.parse(file.data);
      return {
        ...parsed,
        slug: parsed.slug || slug
      } satisfies ResearchFrontmatter;
    })
  );
  return sortByDateDescending(
    entries.filter((item) => (includeDraft ? true : !item.draft))
  );
}

export async function getResearchBySlug(slug: string): Promise<ResearchEntry | null> {
  try {
    const file = await readMdxFile("research", slug);
    const parsed = researchSchema.parse(file.data);
    return {
      ...parsed,
      slug: parsed.slug || slug,
      content: file.content
    };
  } catch {
    return null;
  }
}

export async function getAllCaseStudies(
  includeDraft = false
): Promise<CaseStudyFrontmatter[]> {
  const fileNames = await getCollectionFileNames("case-studies");
  const entries = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = slugFromFileName(fileName);
      const file = await readMdxFile("case-studies", slug);
      const parsed = caseStudySchema.parse(file.data);
      return {
        ...parsed,
        slug: parsed.slug || slug
      } satisfies CaseStudyFrontmatter;
    })
  );
  return sortByDateDescending(
    entries.filter((item) => (includeDraft ? true : !item.draft))
  );
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyEntry | null> {
  try {
    const file = await readMdxFile("case-studies", slug);
    const parsed = caseStudySchema.parse(file.data);
    return {
      ...parsed,
      slug: parsed.slug || slug,
      content: file.content
    };
  } catch {
    return null;
  }
}

export async function getAllProjectContent(
  includeDraft = false
): Promise<ProjectContentFrontmatter[]> {
  const fileNames = await getCollectionFileNames("projects");
  const entries = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = slugFromFileName(fileName);
      const file = await readMdxFile("projects", slug);
      const parsed = projectContentSchema.parse(file.data);
      return {
        ...parsed,
        slug: parsed.slug || slug
      } satisfies ProjectContentFrontmatter;
    })
  );

  return entries.filter((item) => (includeDraft ? true : !item.draft));
}

export async function getProjectContentBySlug(slug: string): Promise<ProjectContentEntry | null> {
  try {
    const file = await readMdxFile("projects", slug);
    const parsed = projectContentSchema.parse(file.data);
    return {
      ...parsed,
      slug: parsed.slug || slug,
      content: file.content
    };
  } catch {
    return null;
  }
}

export async function renderMdx(source: string, components: MDXComponents = {}) {
  const { content } = await compileMDX({
    source,
    components: {
      ...mdxComponents,
      ...components
    },
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          rehypeHighlight,
          [rehypeAutolinkHeadings, { behavior: "wrap" }]
        ]
      }
    }
  });
  return content;
}

function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractMdxHeadings(source: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const lines = source.split("\n");

  lines.forEach((line) => {
    const heading2 = line.match(/^##\s+(.+)$/);
    const heading3 = line.match(/^###\s+(.+)$/);
    if (heading2) {
      const text = heading2[1].trim();
      headings.push({ id: headingId(text), text, level: 2 });
    }
    if (heading3) {
      const text = heading3[1].trim();
      headings.push({ id: headingId(text), text, level: 3 });
    }
  });

  return headings;
}

export const extractBlogHeadings = extractMdxHeadings;
