import { AIContextMode } from "@/types/ai";

export interface FloatingAssistantContext {
  mode: AIContextMode;
  projectSlug?: string;
  entrySlug?: string;
  routeLabel: string;
}

function safeSegment(pathname: string, index: number): string | undefined {
  const segments = pathname.split("/").filter(Boolean);
  const segment = segments[index];
  if (!segment) return undefined;
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function resolveFloatingAssistantContext(pathname: string): FloatingAssistantContext {
  if (pathname === "/") {
    return { mode: "homepage", routeLabel: "Homepage" };
  }

  if (pathname.startsWith("/projects/")) {
    return {
      mode: "project",
      projectSlug: safeSegment(pathname, 1),
      routeLabel: "Project Page"
    };
  }

  if (pathname === "/projects") {
    return { mode: "homepage", routeLabel: "Projects" };
  }

  if (pathname.startsWith("/blog/")) {
    return {
      mode: "blog",
      entrySlug: safeSegment(pathname, 1),
      routeLabel: "Blog Article"
    };
  }

  if (pathname === "/blog") {
    return { mode: "insights", routeLabel: "Blog Index" };
  }

  if (pathname.startsWith("/research/")) {
    return {
      mode: "research",
      entrySlug: safeSegment(pathname, 1),
      routeLabel: "Research Entry"
    };
  }

  if (pathname === "/research") {
    return { mode: "insights", routeLabel: "Research Index" };
  }

  if (pathname.startsWith("/case-studies/")) {
    return {
      mode: "case-study",
      entrySlug: safeSegment(pathname, 1),
      routeLabel: "Case Study"
    };
  }

  if (pathname === "/case-studies" || pathname === "/insights") {
    return { mode: "insights", routeLabel: "Insights" };
  }

  if (pathname === "/about") return { mode: "about", routeLabel: "About" };
  if (pathname === "/recruiters") return { mode: "recruiter", routeLabel: "Recruiter Brief" };
  if (pathname === "/resume") return { mode: "resume", routeLabel: "Resume" };
  if (pathname === "/contact") return { mode: "contact", routeLabel: "Contact" };
  if (pathname === "/services") return { mode: "services", routeLabel: "Services" };
  if (pathname === "/experience") return { mode: "experience", routeLabel: "Experience" };

  return { mode: "homepage", routeLabel: "Portfolio" };
}
