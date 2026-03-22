import { Project } from "@/types/project";

export const projectCategoryLabels: Record<Project["category"], string> = {
  ai: "AI",
  "full-stack": "Full-Stack",
  frontend: "Frontend",
  backend: "Backend",
  tooling: "Tooling"
};

export const projectStatusLabels: Record<Project["status"], string> = {
  live: "Live",
  "in-progress": "In Progress",
  archived: "Archived"
};

export function getProjectCategoryLabel(category: Project["category"]): string {
  return projectCategoryLabels[category];
}

export function getProjectStatusLabel(status: Project["status"]): string {
  return projectStatusLabels[status];
}

export function compareProjectsByImpact(a: Project, b: Project): number {
  const featuredDelta = Number(b.featured) - Number(a.featured);
  if (featuredDelta !== 0) return featuredDelta;

  const caseStudyDelta = Number(b.hasCaseStudy) - Number(a.hasCaseStudy);
  if (caseStudyDelta !== 0) return caseStudyDelta;

  const liveDelta = Number(b.status === "live") - Number(a.status === "live");
  if (liveDelta !== 0) return liveDelta;

  return a.title.localeCompare(b.title);
}
