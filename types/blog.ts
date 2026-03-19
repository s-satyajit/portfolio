export interface BlogFrontmatter {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  date: string;
  category?: string;
  tags: string[];
  readTime?: string;
  cover?: string;
  coverAlt?: string;
  featured?: boolean;
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
