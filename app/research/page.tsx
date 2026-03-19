import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { getAllResearchEntries } from "@/lib/mdx";
import { buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata = buildPageMetadata({
  title: "Research & Publications",
  description:
    "Research track and publication-oriented work by Satyajit Samal, including abstracts, contribution notes, and status labels.",
  path: "/research"
});

export default async function ResearchPage() {
  const entries = await getAllResearchEntries(true);

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Research and publications track"
        description="Technical analysis and publication-oriented writing with transparent status labeling."
      />
      <Container className="pb-20">
        <div className="space-y-4">
          {entries.map((entry) => (
            <article key={entry.slug} className="rounded-2xl border border-border bg-surface-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-heading text-2xl">
                  <Link href={`/research/${entry.slug}`} className="hover:text-accent">
                    {entry.title}
                  </Link>
                </h2>
                <span className="rounded-full border border-border px-2 py-0.5 text-xs text-accent">
                  {entry.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-text-secondary">{entry.summary}</p>
              <p className="mt-2 text-xs text-text-secondary">
                {entry.venue} • {formatDate(entry.date)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Link href={`/research/${entry.slug}`} className="text-sm text-accent hover:text-cyan-300">
                  Read research note
                </Link>
                {entry.links?.pdf ? (
                  <ButtonLink
                    href={entry.links.pdf}
                    variant="secondary"
                    external
                    className="px-3 py-1.5 text-xs"
                  >
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
