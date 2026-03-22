import { BlogFrontmatter } from "@/types/blog";

export function parseReadMinutes(readTime?: string): number | null {
  if (!readTime) return null;
  const match = readTime.match(/(\d+)/);
  if (!match) return null;
  const minutes = Number(match[1]);
  return Number.isFinite(minutes) ? minutes : null;
}

export function formatAudience(audience?: BlogFrontmatter["audience"]): string {
  if (!audience) return "General";
  if (audience === "engineer") return "Engineers";
  if (audience === "recruiter") return "Recruiters";
  if (audience === "client") return "Clients";
  return "General";
}

export function formatDifficulty(difficulty?: BlogFrontmatter["difficulty"]): string {
  if (!difficulty) return "Mixed";
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}
