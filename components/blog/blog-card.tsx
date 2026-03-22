import Image from "next/image";
import Link from "next/link";

import { BlogFrontmatter } from "@/types/blog";
import { formatAudience, formatDifficulty } from "@/lib/blog-utils";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: BlogFrontmatter;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group rounded-2xl border border-border bg-surface-card p-4 transition hover:-translate-y-1 hover:border-accent/45">
      {post.cover ? (
        <Link
          href={`/blog/${post.slug}`}
          className="relative mb-4 block h-44 overflow-hidden rounded-xl border border-border"
        >
          <Image
            src={post.cover}
            alt={post.coverAlt || `${post.title} cover`}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
      ) : null}

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
          <span>{formatDate(post.date)}</span>
          {post.readTime ? <span>{post.readTime}</span> : null}
          {post.category ? (
            <span className="rounded-full border border-border px-2 py-0.5 uppercase tracking-[0.14em]">
              {post.category}
            </span>
          ) : null}
          {post.difficulty ? (
            <span className="rounded-full border border-border px-2 py-0.5">
              {formatDifficulty(post.difficulty)}
            </span>
          ) : null}
          {post.audience ? (
            <span className="rounded-full border border-border px-2 py-0.5">
              {formatAudience(post.audience)}
            </span>
          ) : null}
          {post.draft ? (
            <span className="rounded-full border border-amber-400/35 bg-amber-500/10 px-2 py-0.5 text-amber-200">
              Draft
            </span>
          ) : null}
        </div>
        <h3 className="font-heading text-2xl leading-tight">
          <Link href={`/blog/${post.slug}`} className="hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="text-sm text-text-secondary">{post.excerpt}</p>
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={`${post.slug}-${tag}`}
              className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
