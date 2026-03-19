"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((module) => module.GitHubCalendar),
  {
    ssr: false
  }
);

interface GithubHeatmapProps {
  username: string;
  compact?: boolean;
}

export function GithubHeatmap({ username, compact = false }: GithubHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const calendar = calendarRef.current;
    if (!container || !calendar) return;

    const recalculate = () => {
      const containerWidth = container.clientWidth;
      const calendarWidth = calendar.offsetWidth;
      const calendarHeight = calendar.offsetHeight;

      if (!containerWidth || !calendarWidth || !calendarHeight) return;

      const fitScale = containerWidth / calendarWidth;
      const nextScale = Math.max(0.65, fitScale);
      setScale(nextScale);
      setScaledHeight(calendarHeight * nextScale);
    };

    recalculate();

    const observer = new ResizeObserver(recalculate);
    observer.observe(container);
    observer.observe(calendar);

    return () => observer.disconnect();
  }, [compact, username]);

  return (
    <div className="rounded-2xl border border-border bg-surface-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-heading text-lg">GitHub Contribution Activity</p>
          <p className="text-xs text-text-secondary">Live calendar from @{username}</p>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-accent hover:text-cyan-300"
        >
          View profile
        </a>
      </div>

      <div ref={containerRef} className="w-full overflow-hidden pb-1">
        <div
          className="relative w-full"
          style={{ height: scaledHeight ? `${scaledHeight}px` : undefined }}
        >
          <div
            ref={calendarRef}
            className="inline-block origin-top-left"
            style={{ transform: `scale(${scale})` }}
          >
            <GitHubCalendar
              username={username}
              blockSize={compact ? 11 : 14}
              blockMargin={compact ? 3 : 4}
              fontSize={compact ? 12 : 14}
              colorScheme="dark"
              theme={{
                dark: ["#0f1728", "#083344", "#155e75", "#0891b2", "#22d3ee"],
                light: ["#e2e8f0", "#bae6fd", "#7dd3fc", "#38bdf8", "#0284c7"]
              }}
              labels={{
                totalCount: "{{count}} contributions in the last year"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
