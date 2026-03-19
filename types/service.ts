export interface ServiceItem {
  slug: string;
  title: string;
  summary: string;
  deliverables: string[];
  audience: "startup" | "founder" | "team" | "recruiter";
}
