export const contactCategoryValues = [
  "job-opportunity",
  "freelance-project",
  "collaboration",
  "general-message"
] as const;

export const contactTimelineValues = [
  "immediate",
  "within-2-weeks",
  "this-month",
  "next-quarter",
  "flexible"
] as const;

export const contactBudgetValues = [
  "not-applicable",
  "under-500",
  "500-2000",
  "2000-5000",
  "5000-plus",
  "to-be-discussed"
] as const;

export const contactPreferredContactValues = ["email", "linkedin", "video-call"] as const;

export type ContactCategory = (typeof contactCategoryValues)[number];
export type ContactTimeline = (typeof contactTimelineValues)[number];
export type ContactBudget = (typeof contactBudgetValues)[number];
export type ContactPreferredContact = (typeof contactPreferredContactValues)[number];

export interface ContactSubmission {
  name: string;
  email: string;
  category: ContactCategory;
  message: string;
  organization?: string;
  roleTitle?: string;
  timeline?: ContactTimeline;
  budget?: ContactBudget;
  preferredContact?: ContactPreferredContact;
  consent: boolean;
  startedAt: number;
  website?: string;
  fax?: string;
}
