export interface ProjectLinks {
  github?: string;
  live?: string;
  caseStudy?: string;
}

export interface ProjectOutcome {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
  architecture: string[];
  images: string[];
  links: ProjectLinks;
  featured: boolean;
  hasCaseStudy: boolean;
  category: "ai" | "full-stack" | "frontend" | "backend" | "tooling";
  status: "live" | "in-progress" | "archived";
  outcomes: ProjectOutcome[];
  lessonsLearned: string[];
}
