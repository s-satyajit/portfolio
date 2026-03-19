export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  type: "internship" | "freelance" | "education" | "personal";
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  tech: string[];
}

export interface CurrentBuildItem {
  id: string;
  title: string;
  description: string;
  stage: "building" | "researching" | "shipping";
  tech: string[];
}
