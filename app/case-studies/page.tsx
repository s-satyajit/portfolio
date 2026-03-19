import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { getAllCaseStudies } from "@/lib/mdx";
import { buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata = buildPageMetadata({
  title: "Case Studies",
  description:
    "Case studies and technical analyses from product and architecture decisions by Satyajit Samal.",
  path: "/case-studies"
});

export default async function CaseStudiesPage() {
  const entries = await getAllCaseStudies(true);

  return (
    <>
      <PageHeader
        eyebrow="Case Studies"
        title="How I reason through product and system decisions"
        description="Structured analyses designed to show problem framing, alternatives, and final implementation choices."
      />
      <Container className="pb-20">
        <div className="space-y-4">
          {entries.map((entry) => (
            <article key={entry.slug} className="rounded-2xl border border-border bg-surface-card p-5">
              <h2 className="font-heading text-2xl">
                <Link href={`/case-studies/${entry.slug}`} className="hover:text-accent">
                  {entry.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-text-secondary">{entry.context}</p>
              <p className="mt-2 text-sm text-text-secondary">
                <span className="text-text-primary">Conclusion: </span>
                {entry.conclusion}
              </p>
              <p className="mt-3 text-xs text-text-secondary">{formatDate(entry.date)}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Link href={`/case-studies/${entry.slug}`} className="text-sm text-accent hover:text-cyan-300">
                  Read full case study
                </Link>
                {entry.pdf ? (
                  <ButtonLink href={entry.pdf} variant="secondary" external className="px-3 py-1.5 text-xs">
                    Open PDF
                  </ButtonLink>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
