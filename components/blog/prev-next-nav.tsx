import Link from "next/link";

import { BlogFrontmatter } from "@/types/blog";

interface PrevNextNavProps {
  previous?: BlogFrontmatter;
  next?: BlogFrontmatter;
}

export function PrevNextNav({ previous, next }: PrevNextNavProps) {
  if (!previous && !next) return null;

  return (
    <section className="grid gap-3 sm:grid-cols-2">
      {previous ? (
        <Link
          href={`/blog/${previous.slug}`}
          className="rounded-xl border border-border bg-surface-card p-4 transition hover:border-accent/45"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Previous</p>
          <p className="mt-1 font-heading text-lg">{previous.title}</p>
          <p className="mt-1 text-xs text-text-secondary">{previous.readTime}</p>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="rounded-xl border border-border bg-surface-card p-4 text-left transition hover:border-accent/45 sm:text-right"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Next</p>
          <p className="mt-1 font-heading text-lg">{next.title}</p>
          <p className="mt-1 text-xs text-text-secondary">{next.readTime}</p>
        </Link>
      ) : null}
    </section>
  );
}
