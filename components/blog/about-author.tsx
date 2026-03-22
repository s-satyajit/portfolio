import Image from "next/image";
import Link from "next/link";

import { authorProfile } from "@/data/author";

export function AboutAuthor() {
  return (
    <section className="rounded-2xl border border-border bg-surface-card p-5">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">About the Author</p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-border">
          <Image
            src={authorProfile.avatar}
            alt={authorProfile.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="space-y-1">
          <p className="font-heading text-xl">{authorProfile.name}</p>
          <p className="text-sm text-text-secondary">{authorProfile.role}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">{authorProfile.longBio}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {authorProfile.social.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
          >
            {item.label}
          </a>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={authorProfile.aboutUrl}
          className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
        >
          Learn More About Me
        </Link>
        <Link
          href={authorProfile.projectUrl}
          className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
        >
          Explore Projects
        </Link>
        <Link
          href={authorProfile.contactUrl}
          className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
        >
          Contact
        </Link>
      </div>
    </section>
  );
}
