import { ServiceItem } from "@/types/service";

export const services: ServiceItem[] = [
  {
    slug: "portfolio-engineering",
    title: "Premium Portfolio Websites",
    summary:
      "Custom portfolio experiences for engineers, creators, and founders who need trust-first positioning.",
    deliverables: [
      "Conversion-focused homepage architecture",
      "SEO and metadata foundations",
      "Content-driven maintainable structure"
    ],
    audience: "founder"
  },
  {
    slug: "full-stack-products",
    title: "Full-Stack Web App Development",
    summary: "From product UI to API workflows with deployment-ready engineering practices.",
    deliverables: [
      "Frontend + backend integration",
      "Authentication and user workflows",
      "Deployment and performance readiness"
    ],
    audience: "startup"
  },
  {
    slug: "dashboard-systems",
    title: "Dashboard and Operations Interfaces",
    summary: "Data-heavy interfaces built for clarity, actionability, and real-world usage.",
    deliverables: [
      "Admin and analytics dashboards",
      "Data visualization and reporting blocks",
      "Usability and information hierarchy improvements"
    ],
    audience: "team"
  },
  {
    slug: "ai-feature-integration",
    title: "AI Feature Integration",
    summary:
      "Practical LLM and assistant experiences integrated into products without gimmicks.",
    deliverables: [
      "Prompt and grounding architecture",
      "Secure server-side model integration",
      "AI UX design for real user tasks"
    ],
    audience: "startup"
  }
];
