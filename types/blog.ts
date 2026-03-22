export interface BlogFrontmatter {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  date: string;
  updated?: string;
  category?: string;
  tags: string[];
  audience?: "recruiter" | "engineer" | "client" | "general";
  difficulty?: "beginner" | "intermediate" | "advanced";
  readTime?: string;
  cover?: string;
  coverAlt?: string;
  featured?: boolean;
  featuredRank?: number;
  projectMentions?: string[];
  draft?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogPost extends BlogFrontmatter {
  content: string;
}

export interface BlogHeading {
  id: string;
  text: string;
  level: 2 | 3;
}
