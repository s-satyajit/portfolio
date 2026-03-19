import Link from "next/link";

import { Section } from "@/components/ui/section";

interface PreviewItem {
  title: string;
  summary: string;
  href: string;
  meta?: string;
}

interface ContentPreviewSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  viewAllHref: string;
  viewAllLabel: string;
  items: PreviewItem[];
}

export function ContentPreviewSection({
  id,
  eyebrow,
  title,
  description,
  viewAllHref,
  viewAllLabel,
  items
}: ContentPreviewSectionProps) {
  return (
    <Section id={id} eyebrow={eyebrow} title={title} description={description}>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.href}
            className="rounded-2xl border border-border bg-surface-card p-5 transition hover:border-accent/35"
          >
            {item.meta ? (
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                {item.meta}
              </p>
            ) : null}
            <h3 className="font-heading text-lg">
              <Link href={item.href} className="hover:text-accent">
                {item.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm text-text-secondary">{item.summary}</p>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href={viewAllHref}
          className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
        >
          {viewAllLabel}
        </Link>
      </div>
    </Section>
  );
}
