import Link from "next/link";

export function ArticleEndCta() {
  return (
    <section className="rounded-2xl border border-accent/25 bg-surface-card p-5">
      <p className="font-heading text-2xl">Continue exploring my work</p>
      <p className="mt-2 text-sm text-text-secondary">
        If this article was useful, explore related projects, case studies, and research notes.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/projects"
          className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
        >
          View Projects
        </Link>
        <Link
          href="/case-studies"
          className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
        >
          Read Case Studies
        </Link>
        <Link
          href="/research"
          className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
        >
          Explore Research
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent transition hover:border-accent hover:bg-accent hover:text-surface"
        >
          Contact Me
        </Link>
      </div>
    </section>
  );
}
