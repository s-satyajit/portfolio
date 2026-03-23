import { DeviceMockupFields } from "@/types/device-mockup";

export interface CaseStudyPdfReference {
  label: string;
  href: string;
}

export interface CaseStudyFrontmatter extends DeviceMockupFields {
  slug: string;
  title: string;
  subtitle?: string;
  overview?: string;
  focusArea?: string;
  context: string;
  problem: string;
  approach?: string;
  analysis: string;
  conclusion: string;
  nextIteration?: string[];
  toolsOrMethods?: string[];
  pdf?: string;
  pdfReferences?: CaseStudyPdfReference[];
  keyInsights: string[];
  learnings: string[];
  featured?: boolean;
  coverImage?: string;
  date: string;
  tags: string[];
  draft?: boolean;
}

export interface CaseStudyEntry extends CaseStudyFrontmatter {
  content: string;
}
