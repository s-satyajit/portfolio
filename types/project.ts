import { DeviceMockupFields } from "@/types/device-mockup";

export interface ProjectLinks {
  github?: string;
  live?: string;
  caseStudy?: string;
}

export interface ProjectOutcome {
  label: string;
  value: string;
}

export interface Project extends DeviceMockupFields {
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
  showOnHomepage: boolean;
  hasCaseStudy: boolean;
  category: "ai" | "full-stack" | "frontend" | "backend" | "tooling";
  status: "live" | "in-progress" | "archived";
  outcomes: ProjectOutcome[];
  lessonsLearned: string[];
  mockupTitle?: string;
  order?: number;
  draft?: boolean;
}
