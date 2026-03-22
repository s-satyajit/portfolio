import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import { PageBackButton } from "@/components/layout/page-back-button";
import { authorProfile } from "@/data/author";
import { formatAudience, formatDifficulty } from "@/lib/blog-utils";
import { BlogFrontmatter } from "@/types/blog";

interface BlogHeroProps {
  title: string;
  subtitle?: string;
  excerpt: string;
  meta: ReactNode;
  tags: string[];
  audience?: BlogFrontmatter["audience"];
  difficulty?: BlogFrontmatter["difficulty"];
  updated?: string;
}

export function BlogHero({
  title,
  subtitle,
  excerpt,
  meta,
  tags,
  audience,
  difficulty,
  updated
}: BlogHeroProps) {
  return (
    <header className="space-y-4 rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
      <PageBackButton iconOnly />
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Blog</p>
      <h1 className="font-heading text-4xl leading-tight sm:text-5xl">{title}</h1>
      {subtitle ? <p className="text-base text-text-secondary">{subtitle}</p> : null}
      <p className="text-sm leading-relaxed text-text-secondary">{excerpt}</p>

      <div className="flex flex-wrap gap-2 text-xs text-text-secondary">{meta}</div>

      <div className="flex flex-wrap gap-2">
        {audience ? (
          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary">
            Audience: {formatAudience(audience)}
          </span>
        ) : null}
        {difficulty ? (
          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary">
            Difficulty: {formatDifficulty(difficulty)}
          </span>
        ) : null}
        {updated ? (
          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary">
            Updated: {updated}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog?tag=${encodeURIComponent(tag)}`}
            className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
          >
            #{tag}
          </Link>
        ))}
      </div>

      <Link
        href={authorProfile.aboutUrl}
        className="mt-2 inline-flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition hover:border-accent/50"
      >
        <span className="relative block h-10 w-10 overflow-hidden rounded-lg border border-border">
          <Image
            src={authorProfile.avatar}
            alt={authorProfile.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </span>
        <span>
          <span className="block text-sm font-medium text-text-primary">{authorProfile.name}</span>
          <span className="block text-xs text-text-secondary">{authorProfile.role}</span>
        </span>
      </Link>
    </header>
  );
}
