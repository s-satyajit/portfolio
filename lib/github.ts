import { buildFallbackContributionDays } from "@/data/github-fallback";
import {
    ContributionDay,
    ContributionWeek,
    ContributionsPayload,
    ContributionsSummary
} from "@/types/github";

function levelFromCount(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 7) return 3;
  return 4;
}

function parseContributionSvg(svg: string): ContributionDay[] {
  const days: ContributionDay[] = [];
  const regex = /data-date="([^"]+)"[^>]*data-count="(\d+)"/g;
  let match = regex.exec(svg);

  while (match) {
    const date = match[1];
    const count = Number(match[2]);
    days.push({
      date,
      count,
      level: levelFromCount(count)
    });
    match = regex.exec(svg);
  }

  return days.sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

function groupByWeek(days: ContributionDay[]): ContributionWeek[] {
  const weeks: ContributionWeek[] = [];
  let current: ContributionDay[] = [];

  for (const day of days) {
    current.push(day);
    if (current.length === 7) {
      weeks.push({
        startDate: current[0].date,
        days: current
      });
      current = [];
    }
  }

  if (current.length > 0) {
    weeks.push({
      startDate: current[0].date,
      days: current
    });
  }

  return weeks;
}

function summary(days: ContributionDay[]): ContributionsSummary {
  const totalContributions = days.reduce((acc, day) => acc + day.count, 0);
  const activeDays = days.filter((day) => day.count > 0).length;

  let currentStreak = 0;
  let longestStreak = 0;
  for (const day of days) {
    if (day.count > 0) {
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return { totalContributions, activeDays, longestStreak };
}

async function fetchLiveContributions(username: string): Promise<ContributionDay[]> {
  const end = new Date();
  const start = new Date(end.getTime() - 370 * 24 * 60 * 60 * 1000);
  const from = start.toISOString().slice(0, 10);
  const to = end.toISOString().slice(0, 10);

  const response = await fetch(
    `https://github.com/users/${username}/contributions?from=${from}&to=${to}`,
    {
      headers: {
        "User-Agent": "satyajit-portfolio"
      },
      next: {
        revalidate: 60 * 60 * 6
      }
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch contribution svg");
  }

  const svg = await response.text();
  const parsed = parseContributionSvg(svg);
  if (parsed.length < 200) {
    throw new Error("Contribution data too small");
  }
  return parsed;
}

export async function getContributionsPayload(
  username: string
): Promise<ContributionsPayload> {
  try {
    const liveDays = await fetchLiveContributions(username);
    return {
      source: "live",
      weeks: groupByWeek(liveDays),
      summary: summary(liveDays),
      fetchedAt: new Date().toISOString()
    };
  } catch {
    const fallbackDays = buildFallbackContributionDays();
    return {
      source: "fallback",
      weeks: groupByWeek(fallbackDays),
      summary: summary(fallbackDays),
      fetchedAt: new Date().toISOString()
    };
  }
}
