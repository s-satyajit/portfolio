import { CaseStudyFrontmatter } from "@/types/case-study";
import { InsightItem } from "@/types/insights";
import { ResearchFrontmatter } from "@/types/research";

export function researchToInsightItem(entry: ResearchFrontmatter): InsightItem {
  return {
    kind: "research",
    slug: entry.slug,
    title: entry.title,
    date: entry.date,
    tags: entry.tags,
    summary: entry.summary,
    status: entry.status,
    venue: entry.venue,
    contribution: entry.contribution,
    pdf: entry.links?.pdf,
    external: entry.links?.external
  };
}

export function caseStudyToInsightItem(entry: CaseStudyFrontmatter): InsightItem {
  return {
    kind: "case-study",
    slug: entry.slug,
    title: entry.title,
    subtitle: entry.subtitle,
    date: entry.date,
    tags: entry.tags,
    summary: entry.overview || entry.context,
    overview: entry.overview,
    focusArea: entry.focusArea,
    context: entry.context,
    problem: entry.problem,
    conclusion: entry.conclusion,
    keyInsights: entry.keyInsights,
    learnings: entry.learnings,
    pdf: entry.pdf
  };
}

export function sortInsightsByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getUniqueTags(items: InsightItem[]): string[] {
  return Array.from(new Set(items.flatMap((item) => item.tags)))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}
