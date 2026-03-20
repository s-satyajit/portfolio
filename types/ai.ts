export type AIPersona = "recruiter" | "client" | "collaborator" | "general";
export type AIConfidence = "high" | "medium" | "low";
export type AIContextMode = "homepage" | "recruiter" | "project" | "about";

export interface AIRequestBody {
  query: string;
  persona?: AIPersona;
  mode?: AIContextMode;
  projectSlug?: string;
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
}
