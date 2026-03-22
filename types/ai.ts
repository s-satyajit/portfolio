export type AIPersona = "recruiter" | "client" | "collaborator" | "general";
export type AIConfidence = "high" | "medium" | "low";
export type AIContextMode =
  | "homepage"
  | "recruiter"
  | "project"
  | "about"
  | "contact"
  | "resume"
  | "blog"
  | "research"
  | "case-study"
  | "insights"
  | "services"
  | "experience";

export interface AIRequestBody {
  query: string;
  persona?: AIPersona;
  mode?: AIContextMode;
  projectSlug?: string;
  entrySlug?: string;
}

export interface AIResponseBody {
  answer: string;
  sources: string[];
  confidence: AIConfidence;
}

export interface AIQueryOptions {
  persona?: AIPersona;
  mode?: AIContextMode;
  projectSlug?: string;
  entrySlug?: string;
}
