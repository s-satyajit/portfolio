import Link from "next/link";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/ui/page-header";
import { buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { getAllCaseStudies, getAllResearchEntries } from "@/lib/mdx";

export const metadata = buildPageMetadata({
  title: "Research + Case Studies",
  description:
    "Unified page for research publications and case studies, combining analytical depth and implementation thinking.",
  path: "/insights"
});

export default async function InsightsPage() {
  const [researchEntries, caseStudies] = await Promise.all([
    getAllResearchEntries(true),
    getAllCaseStudies(true)
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Research and case studies in one place"
        description="This page combines publication-track research with practical case-study analysis."
      />

      <Container className="space-y-10 pb-20">
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-heading text-2xl">Research / Publications</h2>
            <Link href="/research" className="text-sm text-accent">
              View dedicated research page
            </Link>
          </div>
          <div className="space-y-4">
            {researchEntries.map((entry) => (
              <article
                key={entry.slug}
                className="rounded-2xl border border-border bg-surface-card p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-heading text-xl">
                    <Link href={`/research/${entry.slug}`} className="hover:text-accent">
                      {entry.title}
                    </Link>
                  </h3>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-accent">
                    {entry.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-secondary">{entry.summary}</p>
                <p className="mt-2 text-xs text-text-secondary">
                  {entry.venue} • {formatDate(entry.date)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-heading text-2xl">Case Studies</h2>
            <Link href="/case-studies" className="text-sm text-accent">
              View dedicated case studies page
            </Link>
          </div>
          <div className="space-y-4">
            {caseStudies.map((entry) => (
              <article
                key={entry.slug}
                className="rounded-2xl border border-border bg-surface-card p-5"
              >
                <h3 className="font-heading text-xl">
                  <Link href={`/case-studies/${entry.slug}`} className="hover:text-accent">
                    {entry.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-text-secondary">{entry.context}</p>
                <p className="mt-2 text-sm text-text-secondary">
                  <span className="text-text-primary">Conclusion: </span>
                  {entry.conclusion}
                </p>
                <p className="mt-2 text-xs text-text-secondary">{formatDate(entry.date)}</p>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
