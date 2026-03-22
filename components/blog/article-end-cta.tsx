import Link from "next/link";

export function ArticleEndCta() {
  return (
    <section className="rounded-2xl border border-accent/25 bg-surface-card p-5">
      <p className="font-heading text-2xl">Continue through the portfolio ecosystem</p>
      <p className="mt-2 text-sm text-text-secondary">
        Use this article as a starting point, then jump into project proof, case-study analysis,
        and recruiter-focused highlights.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/projects"
          className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
        >
          View Projects
        </Link>
        <Link
          href="/insights"
          className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
        >
          Insights Hub
        </Link>
        <Link
          href="/recruiters"
          className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
        >
          Recruiter Brief
        </Link>
        <Link
          href="/resume"
          className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
        >
          Resume
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
