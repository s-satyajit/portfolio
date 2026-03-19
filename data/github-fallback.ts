import { ContributionDay } from "@/types/github";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function levelFromCount(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 7) return 3;
  return 4;
}

function pseudoCount(index: number): number {
  const base = (index * 7 + 3) % 10;
  if (index % 11 === 0) return 0;
  if (index % 17 === 0) return base + 5;
  return base;
}

export function buildFallbackContributionDays(
  totalDays = 371
): ContributionDay[] {
  const today = new Date();
  const days: ContributionDay[] = [];
  for (let i = totalDays - 1; i >= 0; i -= 1) {
    const date = new Date(today.getTime() - i * ONE_DAY_MS);
    const count = pseudoCount(i);
    days.push({
      date: date.toISOString().slice(0, 10),
      count,
      level: levelFromCount(count)
    });
  }
  return days;
}
