"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight, BriefcaseBusiness, FolderGit2, Layers3 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { socialLinks } from "@/data/social-links";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((module) => module.GitHubCalendar),
  {
    ssr: false
  }
);

interface GithubHeatmapProps {
  username: string;
  compact?: boolean;
  className?: string;
}

export function GithubHeatmap({ username, compact = false, className }: GithubHeatmapProps) {
  const githubProfile = socialLinks.find((item) => item.label === "GitHub")?.href;

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
    <div className={cn("flex h-full flex-col rounded-2xl border border-border bg-surface-card p-5", className)}>
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

      <div className={cn("mt-4 rounded-xl border border-border bg-surface p-3", compact ? "" : "p-4")}>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          Quick Links
        </p>
        <p className="mt-1 text-xs leading-relaxed text-text-secondary">
          Jump to profile proof, shipped projects, and recruiter-fit overview.
        </p>

        <div className="mt-3 grid items-stretch gap-2 sm:grid-cols-3">
          <a
            href={githubProfile || `https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col rounded-lg border border-border bg-surface-card px-3 py-2 text-left transition hover:border-accent/50"
          >
            <p className="inline-flex items-center gap-1.5 text-xs font-medium leading-4 text-text-primary">
              <FolderGit2 size={12} className="text-accent" />
              GitHub Profile
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] leading-none text-text-secondary transition group-hover:text-text-primary">
              Open profile
              <ArrowUpRight size={11} />
            </p>
          </a>
          <Link
            href="/projects"
            className="group flex flex-col rounded-lg border border-border bg-surface-card px-3 py-2 text-left transition hover:border-accent/50"
          >
            <p className="inline-flex items-center gap-1.5 text-xs font-medium leading-4 text-text-primary">
              <Layers3 size={12} className="text-accent" />
              Projects
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] leading-none text-text-secondary transition group-hover:text-text-primary">
              Open projects
              <ArrowUpRight size={11} />
            </p>
          </Link>
          <Link
            href="/recruiters"
            className="group flex flex-col rounded-lg border border-border bg-surface-card px-3 py-2 text-left transition hover:border-accent/50"
          >
            <p className="inline-flex items-center gap-1.5 text-xs font-medium leading-4 text-text-primary">
              <BriefcaseBusiness size={12} className="text-accent" />
              Recruiter Brief
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] leading-none text-text-secondary transition group-hover:text-text-primary">
              Open brief
              <ArrowUpRight size={11} />
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
