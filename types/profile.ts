export interface EducationItem {
  degree: string;
  institution: string;
  field: string;
  startYear: number;
  endYear?: number;
  status?: "completed" | "ongoing";
}

export interface Availability {
  internships: boolean;
  freelance: boolean;
  fullTime: boolean;
  note: string;
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
}
