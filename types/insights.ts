import { CaseStudyFrontmatter } from "@/types/case-study";
import { ResearchFrontmatter, ResearchStatus } from "@/types/research";

export type InsightKind = "research" | "case-study";

export type InsightSource = ResearchFrontmatter | CaseStudyFrontmatter;

export interface InsightItem {
  kind: InsightKind;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  status?: ResearchStatus;
  venue?: string;
  contribution?: string;
  context?: string;
  problem?: string;
  conclusion?: string;
  keyInsights?: string[];
  learnings?: string[];
  pdf?: string;
  external?: string;
}
