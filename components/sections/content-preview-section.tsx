import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
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
    <Section id={id} eyebrow={eyebrow} title={title} description={description} className="pt-14">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.href} delay={index * 0.03}>
            <article className="group h-full rounded-2xl border border-border bg-surface-card p-5 transition hover:-translate-y-0.5 hover:border-accent/35">
              {item.meta ? (
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">{item.meta}</p>
              ) : null}
              <h3 className="font-heading text-lg leading-snug">
                <Link href={item.href} className="transition group-hover:text-accent">
                  {item.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.summary}</p>
              <Link
                href={item.href}
                className="mt-4 inline-flex items-center gap-1 text-xs text-text-secondary transition group-hover:text-text-primary"
              >
                Read entry
                <ArrowRight size={12} />
              </Link>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
        >
          {viewAllLabel}
          <ArrowRight size={14} />
        </Link>
      </div>
    </Section>
  );
}
