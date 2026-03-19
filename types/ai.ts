export type AIPersona = "recruiter" | "client" | "collaborator" | "general";
export type AIConfidence = "high" | "medium" | "low";

export interface AIRequestBody {
  query: string;
  persona?: AIPersona;
}

export interface AIResponseBody {
  answer: string;
  sources: string[];
  confidence: AIConfidence;
}
