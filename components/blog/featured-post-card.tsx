import Image from "next/image";
import Link from "next/link";

import { BlogFrontmatter } from "@/types/blog";
import { formatDate } from "@/lib/utils";

interface FeaturedPostCardProps {
  post: BlogFrontmatter;
}

export function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <article className="grid gap-6 rounded-3xl border border-border bg-surface-card p-5 md:grid-cols-[1.1fr_0.9fr] md:p-6">
      <div className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Featured Article</p>
        <h2 className="font-heading text-3xl leading-tight sm:text-4xl">
          <Link href={`/blog/${post.slug}`} className="hover:text-accent">
            {post.title}
          </Link>
        </h2>
        {post.subtitle ? <p className="text-sm text-text-secondary">{post.subtitle}</p> : null}
        <p className="text-sm text-text-secondary">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
          <span>{formatDate(post.date)}</span>
          <span>•</span>
          <span>{post.readTime}</span>
          {post.category ? (
            <>
              <span>•</span>
              <span>{post.category}</span>
            </>
          ) : null}
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex rounded-full border border-accent/40 bg-accent-soft px-4 py-2 text-sm font-medium text-accent transition hover:border-accent hover:bg-accent hover:text-surface"
        >
          Read Featured Post
        </Link>
      </div>

      {post.cover ? (
        <Link
          href={`/blog/${post.slug}`}
          className="relative block min-h-[240px] overflow-hidden rounded-2xl border border-border"
        >
          <Image
            src={post.cover}
            alt={post.coverAlt || `${post.title} cover`}
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
        </Link>
      ) : (
        <div className="min-h-[240px] rounded-2xl border border-border bg-surface-elevated" />
      )}
    </article>
  );
}
