"use client";

import Link from "next/link";
import { Copy, Linkedin, Share2 } from "lucide-react";
import { useMemo, useState } from "react";

interface ArticleShareBarProps {
  title: string;
  path: string;
}

export function ArticleShareBar({ title, path }: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false);

  const absoluteUrl = useMemo(() => {
    if (typeof window === "undefined") return path;
    return `${window.location.origin}${path}`;
  }, [path]);

  const encodedUrl = encodeURIComponent(absoluteUrl);
  const encodedTitle = encodeURIComponent(title);
  const xHref = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-surface-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          <Share2 size={13} />
          Share This Article
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
          >
            <Copy size={13} />
            {copied ? "Copied" : "Copy Link"}
          </button>
          <a
            href={xHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
          >
            Share on X
          </a>
          <a
            href={linkedInHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
          >
            <Linkedin size={13} />
            LinkedIn
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border border-accent/30 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent transition hover:border-accent hover:bg-accent hover:text-surface"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </section>
  );
}
