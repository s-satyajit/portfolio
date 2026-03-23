export interface EducationItem {
  degree: string;
  institution: string;
  field: string;
  startYear: number;
  endYear?: number;
  status?: "completed" | "ongoing";
}

export interface Availability {
  freelance: boolean;
  fullTime: boolean;
  note: string;
}

export interface AboutIntro {
  intro: string;
  direction: string;
  longTerm: string;
}

export interface FocusNowItem {
  title: string;
  detail: string;
  nextStep?: string;
}

export interface JourneyItem {
  id: string;
  period: string;
  title: string;
  description: string;
}

export interface StackCategory {
  title: string;
  items: string[];
}

export interface PersonalNote {
  heading: string;
  paragraphs: string[];
}

export interface Profile {
  name: string;
  shortName: string;
  title: string;
  heroLabel: string;
  location: string;
  baseRegion: string;
  email: string;
  phone?: string;
  image: string;
  bio: string;
  longBio: string;
  education: EducationItem[];
  availability: Availability;
  interests: string[];
  currentlyFocusing: string[];
  aboutIntro: AboutIntro;
  focusNow: FocusNowItem[];
  journey: JourneyItem[];
  stackByCategory: StackCategory[];
  personalNote: PersonalNote;
  opportunityTargets: string[];
  aboutAIPrompts: string[];
}
