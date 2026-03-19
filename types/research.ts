export type ResearchStatus =
  | "published"
  | "accepted"
  | "under-review"
  | "preprint"
  | "in-preparation";

export interface ResearchLinks {
  pdf?: string;
  doi?: string;
  external?: string;
}

export interface ResearchFrontmatter {
  slug: string;
  title: string;
  status: ResearchStatus;
  summary: string;
  abstract: string;
  contribution: string;
  venue: string;
  date: string;
  tags: string[];
  links?: ResearchLinks;
  draft?: boolean;
}

export interface ResearchEntry extends ResearchFrontmatter {
  content: string;
}
