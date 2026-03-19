export interface CaseStudyFrontmatter {
  slug: string;
  title: string;
  context: string;
  problem: string;
  analysis: string;
  conclusion: string;
  pdf?: string;
  keyInsights: string[];
  learnings: string[];
  date: string;
  tags: string[];
  draft?: boolean;
}

export interface CaseStudyEntry extends CaseStudyFrontmatter {
  content: string;
}
