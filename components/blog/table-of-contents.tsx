"use client";

import { useEffect, useState } from "react";

import { BlogHeading } from "@/types/blog";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: BlogHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const headingElements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-96px 0px -60% 0px",
        threshold: [0.1, 0.4, 0.7]
      }
    );

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="rounded-2xl border border-border bg-surface-card p-4">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        Table of Contents
      </p>
      <ul className="space-y-1.5 text-sm text-text-secondary">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pl-3" : ""}>
            <a
              className={cn(
                "transition hover:text-text-primary",
                activeId === heading.id ? "text-accent" : "text-text-secondary"
              )}
              href={`#${heading.id}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
