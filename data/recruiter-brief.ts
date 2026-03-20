import { profile } from "@/data/profile";
import { socialLinks } from "@/data/social-links";

export interface RecruiterRoleFitItem {
  role: string;
  reason: string;
}

export interface RecruiterProofItem {
  id: string;
  label: string;
  projectName: string;
  projectSlug?: string;
  summary: string;
  whatIBuilt: string;
  whyItMatters: string;
  ctaLabel: string;
  ctaHref?: string;
  aiPrompt: string;
}

export interface RecruiterFact {
  label: string;
  value: string;
  href?: string;
}

export interface RecruiterFaqItem {
  question: string;
  answer: string;
}

export interface RecruiterAction {
  label: string;
  href: string;
  external?: boolean;
}

const ongoingProgram =
  profile.education.find((item) => item.status === "ongoing") || profile.education[0];
const latestDegree = profile.education[0];

const github = socialLinks.find((item) => item.label === "GitHub")?.href;
const linkedIn = socialLinks.find((item) => item.label === "LinkedIn")?.href;

export const recruiterHero = {
  eyebrow: "Recruiter Brief",
  title: "Evaluation brief for fast screening",
  description:
    "A grounded view of what I have built, where I fit best, and how I can contribute early in a product team.",
  summaryLines: [
    `I am ${profile.name}, currently pursuing ${ongoingProgram.degree} in ${ongoingProgram.field} at ${ongoingProgram.institution}.`,
    "I build full-stack web products with React/Next.js on the frontend and Node/Express workflows on the backend.",
    "My current direction is applied AI in real product flows, especially grounded assistant experiences that stay useful and factual."
  ]
};

export const recruiterRoleFit: RecruiterRoleFitItem[] = [
  {
    role: "Frontend Developer (React / Next.js)",
    reason: "Strong fit for product UI implementation, dashboard flows, and API-driven frontend work."
  },
  {
    role: "Full-Stack Developer (Entry Level)",
    reason: "Comfortable owning end-to-end features across UI, APIs, auth flow, and deployment."
  },
  {
    role: "Applied AI Engineer (Entry Level)",
    reason:
      "Focused on practical AI feature integration, prompt grounding, and reliable assistant behavior."
  },
  {
    role: "Software Engineer for AI-enabled products",
    reason:
      "Best in teams shipping user-facing products where AI features need thoughtful UX and clear guardrails."
  }
];

export const recruiterStrongestAreas = [
  "React, Next.js, TypeScript, Tailwind CSS for product interfaces.",
  "Node.js and Express for API workflows, auth flow, and backend integration.",
  "Role-based product patterns, dashboard-style interfaces, and CRUD workflows.",
  "Grounded AI assistant integration with strict no-invention response behavior."
];

export const recruiterProductExposure = [
  "Hiring workflow platform with recruiter/candidate role flows (Hirrd).",
  "Realtime multi-user communication workflows (LiveTalk).",
  "Dashboard-style operations system for internal usage (TeamZen).",
  "Context-aware AI assistant integration for portfolio and recruiter Q&A."
];

export const recruiterQuickFacts: RecruiterFact[] = [
  { label: "Name", value: profile.name },
  { label: "Location", value: profile.location },
  { label: "Degree", value: `${latestDegree.degree} in ${latestDegree.field}` },
  {
    label: "Current Program",
    value: `${ongoingProgram.degree} in ${ongoingProgram.field}, ${ongoingProgram.institution}`
  },
  {
    label: "Core Stack",
    value: "Next.js, React, TypeScript, Node.js, Express, MongoDB, Tailwind CSS, Python"
  },
  {
    label: "Current Focus",
    value: "AI-assisted product features, grounded Q&A workflows, and deployment-ready full-stack delivery"
  },
  {
    label: "Preferred Roles",
    value: "Frontend Developer, Full-Stack Developer, Applied AI Engineer (Entry Level)"
  },
  {
    label: "Open To",
    value: "Internships, freelance projects, and full-time roles"
  },
  ...(github ? [{ label: "GitHub", value: "github.com/s-satyajit", href: github }] : []),
  ...(linkedIn
    ? [{ label: "LinkedIn", value: "linkedin.com/in/satyajitsamal", href: linkedIn }]
    : []),
  { label: "Resume", value: "View resume", href: "/resume" },
  { label: "Portfolio", value: "Main portfolio", href: "/" }
];

export const recruiterProofItems: RecruiterProofItem[] = [
  {
    id: "proof-auth-roles",
    label: "Best proof for auth and role workflows",
    projectName: "Hirrd - Job Portal Platform",
    projectSlug: "hirrd-job-portal",
    summary: "A recruiter and candidate workflow platform built around role-specific flows.",
    whatIBuilt:
      "Implemented recruiter and candidate journeys, listing and application flows, protected routes, and deployment.",
    whyItMatters:
      "Shows practical ownership of product workflows where auth and role boundaries matter.",
    ctaLabel: "Open project",
    aiPrompt: "What does Hirrd show about his auth and role-based implementation skills?"
  },
  {
    id: "proof-realtime",
    label: "Best proof for realtime workflow handling",
    projectName: "LiveTalk - Multi-User Chat App",
    projectSlug: "livetalk-chat-app",
    summary: "Realtime multi-user chat experience with low-latency messaging flow.",
    whatIBuilt:
      "Built message pipeline behavior, session-aware chat interactions, and a responsive chat interface.",
    whyItMatters:
      "Shows event-driven thinking and practical handling of realtime UX behavior.",
    ctaLabel: "Open project",
    aiPrompt: "How does LiveTalk demonstrate his realtime product engineering capability?"
  },
  {
    id: "proof-dashboard",
    label: "Best proof for dashboard and operations systems",
    projectName: "TeamZen - Employee Management System",
    projectSlug: "teamzen-employee-management-system",
    summary: "Dashboard-oriented system for employee records and operational workflows.",
    whatIBuilt:
      "Designed data-first screens, record management flows, and modular UI sections for maintainability.",
    whyItMatters:
      "Good indicator for internal tools, admin interfaces, and productivity-oriented products.",
    ctaLabel: "Open project",
    aiPrompt: "Why is TeamZen a useful project for evaluating dashboard and workflow execution?"
  },
  {
    id: "proof-ai-direction",
    label: "Best proof for AI integration direction",
    projectName: "Portfolio AI Assistant (Current Build)",
    summary:
      "A context-aware assistant integrated into this portfolio with strict grounding guardrails.",
    whatIBuilt:
      "Designed mode-based context handling, reusable assistant UI, and backend constraints to avoid invented claims.",
    whyItMatters:
      "Shows applied AI implementation style: useful UX, scoped context, and trust-focused response behavior.",
    ctaLabel: "Open AI section",
    ctaHref: "/#ai-panel",
    aiPrompt: "Has he already implemented AI-assisted features with grounding and guardrails?"
  }
];

export const recruiterLikelyContributions = [
  "Build recruiter-friendly or customer-facing interfaces in React and Next.js.",
  "Integrate frontend with backend APIs and handle data/state flows cleanly.",
  "Implement auth, protected routes, role-based features, and dashboard workflows.",
  "Contribute to Node/Express backend endpoints and practical CRUD operations.",
  "Ship AI-assisted product features with clear prompt grounding and fallback behavior.",
  "Learn new domain context quickly and iterate features based on product feedback."
];

export const recruiterFaq: RecruiterFaqItem[] = [
  {
    question: "What roles is Satyajit best suited for?",
    answer:
      "Frontend Developer, Full-Stack Developer, and applied AI-focused software roles at entry level. The strongest fit is product teams shipping web features with real user workflows."
  },
  {
    question: "What are his strongest technical skills?",
    answer:
      "React, Next.js, TypeScript, Node.js, Express, role-based flows, and practical dashboard/workflow implementation."
  },
  {
    question: "Has he built AI-related features?",
    answer:
      "Yes. The portfolio includes a grounded assistant pattern built to answer from internal context and avoid fabricated claims."
  },
  {
    question: "Can he work across frontend and backend?",
    answer:
      "Yes. His projects combine UI implementation, API integration, auth flow, and deployment across full-stack products."
  },
  {
    question: "What kind of team would he thrive in?",
    answer:
      "A product team where ownership, iteration speed, and engineering clarity matter more than title hierarchy."
  },
  {
    question: "Is he more product-focused or research-focused?",
    answer:
      "Primary orientation is product implementation, with active AI research-writing practice that supports stronger technical decisions."
  },
  {
    question: "What is he currently learning or building?",
    answer:
      "Applied AI integration patterns, grounding workflows for trustworthy assistants, and production-ready full-stack architecture."
  },
  {
    question: "Why should I interview him?",
    answer:
      "He is early-career but already shipping complete projects, communicates clearly through code and writing, and can contribute to practical feature delivery quickly."
  }
];

export const recruiterActions: RecruiterAction[] = [
  { label: "Open Resume", href: "/resume" },
  { label: "View GitHub", href: github || "https://github.com/s-satyajit", external: true },
  {
    label: "View LinkedIn",
    href: linkedIn || "https://www.linkedin.com/in/satyajitsamal/",
    external: true
  },
  { label: "Email Me", href: `mailto:${profile.email}`, external: true },
  { label: "Explore Projects", href: "/projects" }
];

export const recruiterAiSuggestedPrompts = [
  "What roles is he best suited for?",
  "What are his strongest technical skills?",
  "Can he work across frontend and backend?",
  "Which project should I review first?",
  "Has he worked on AI features?",
  "What is his current focus?",
  ...recruiterProofItems.map((item) => item.aiPrompt)
];
