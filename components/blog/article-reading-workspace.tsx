"use client";

import { ReactNode, useMemo, useState } from "react";
import { ArrowUp, BookOpenText, Focus, Type } from "lucide-react";

import { cn } from "@/lib/utils";

type ReaderSize = "sm" | "base" | "lg";

interface ArticleReadingWorkspaceProps {
  children: ReactNode;
  readTime?: string;
  wordCount: number;
}

export function ArticleReadingWorkspace({
  children,
  readTime,
  wordCount
}: ArticleReadingWorkspaceProps) {
  const [size, setSize] = useState<ReaderSize>("base");
  const [focusMode, setFocusMode] = useState(false);

  const proseClass = useMemo(() => {
    if (size === "sm") {
      return "text-[0.95rem] leading-7";
    }
    if (size === "lg") {
      return "text-[1.06rem] leading-8";
    }
    return "text-base leading-7";
  }, [size]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface-card p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1">
            <BookOpenText size={13} />
            {readTime || "Reading time unavailable"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1">
            <Type size={13} />
            {wordCount} words
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-full border border-border bg-surface p-1">
            {(["sm", "base", "lg"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSize(option)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs transition",
                  size === option
                    ? "bg-accent-soft text-accent"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setFocusMode((prev) => !prev)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition",
              focusMode
                ? "border-accent/40 bg-accent-soft text-accent"
                : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
            )}
          >
            <Focus size={13} />
            {focusMode ? "Exit Focus" : "Focus Mode"}
          </button>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
          >
            <ArrowUp size={13} />
            Top
          </button>
        </div>
      </div>

      <div
        className={cn(
          "rounded-2xl border border-border bg-surface-card p-6 transition-all sm:p-8",
          focusMode ? "mx-auto max-w-3xl" : "max-w-none"
        )}
      >
        <div className={cn("prose prose-invert max-w-none", proseClass)}>{children}</div>
      </div>
    </section>
  );
}
