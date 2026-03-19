export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  startDate: string;
  days: ContributionDay[];
}

export interface ContributionsSummary {
  totalContributions: number;
  activeDays: number;
  longestStreak: number;
}

export interface ContributionsPayload {
  source: "live" | "fallback";
  weeks: ContributionWeek[];
  summary: ContributionsSummary;
  fetchedAt: string;
}
