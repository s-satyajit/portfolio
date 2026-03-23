import Link from "next/link";
import { notFound } from "next/navigation";

import { TableOfContents } from "@/components/blog/table-of-contents";
import { InsightsAIPanel } from "@/components/insights/insights-ai-panel";
import { Container } from "@/components/layout/container";
import { PageBackButton } from "@/components/layout/page-back-button";
import { DeviceMockupShowcase } from "@/components/mdx/device-mockup-showcase";
import { ButtonLink } from "@/components/ui/button-link";
import { DocumentShowcase } from "@/components/ui/document-showcase";
import { SchemaScript } from "@/components/ui/schema-script";
import {
  extractMdxHeadings,
  getAllCaseStudies,
  getAllResearchEntries,
  getResearchBySlug,
  renderMdx
} from "@/lib/mdx";
import { getPdfSeoSignals } from "@/lib/pdf-seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

interface ResearchDetailPageProps {
  params: Promise<{ slug: string }>;
}

function statusClass(status: string): string {
  if (status === "published") return "border-emerald-400/35 bg-emerald-500/10 text-emerald-200";
  if (status === "accepted") return "border-cyan-400/35 bg-cyan-500/10 text-cyan-200";
  if (status === "under-review") return "border-amber-400/35 bg-amber-500/10 text-amber-200";
  if (status === "preprint") return "border-violet-400/35 bg-violet-500/10 text-violet-200";
  return "border-border bg-surface text-text-secondary";
}

function statusLabel(status: string): string {
  if (status === "under-review") return "Under Review";
  if (status === "in-preparation") return "In Preparation";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export async function generateStaticParams() {
  const entries = await getAllResearchEntries(true);
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: ResearchDetailPageProps) {
  const { slug } = await params;
  const entry = await getResearchBySlug(slug);
  if (!entry) return {};

  const pdfSignals = await getPdfSeoSignals(entry.links?.pdf);
  const description = pdfSignals?.summary
    ? `${entry.summary} ${pdfSignals.summary}`.slice(0, 300)
    : entry.summary;

  return buildPageMetadata({
    title: entry.title,
    description,
    path: `/research/${entry.slug}`,
    keywords: [...entry.tags, ...(pdfSignals?.keywords ?? [])],
    type: "article"
  });
}

export default async function ResearchDetailPage({ params }: ResearchDetailPageProps) {
  const { slug } = await params;
  const entry = await getResearchBySlug(slug);
  if (!entry) notFound();

  const [content, allResearchEntries, allCaseStudies, pdfSignals] = await Promise.all([
    renderMdx(entry.content),
    getAllResearchEntries(true),
    getAllCaseStudies(true),
    getPdfSeoSignals(entry.links?.pdf)
  ]);

  const headings = extractMdxHeadings(entry.content);

  const articleDescription = pdfSignals?.summary
    ? `${entry.summary} ${pdfSignals.summary}`.slice(0, 300)
    : entry.summary;

  const sortedResearch = [...allResearchEntries].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const currentIndex = sortedResearch.findIndex((item) => item.slug === entry.slug);
  const previous = currentIndex >= 0 ? sortedResearch[currentIndex + 1] : undefined;
  const next = currentIndex > 0 ? sortedResearch[currentIndex - 1] : undefined;

  const relatedResearch = sortedResearch
    .filter((item) => item.slug !== entry.slug)
    .filter((item) => item.tags.some((tag) => entry.tags.includes(tag)))
    .slice(0, 3);

  const relatedCaseStudies = allCaseStudies
    .filter((item) => item.tags.some((tag) => entry.tags.includes(tag)))
    .slice(0, 3);

  return (
    <>
      <SchemaScript
        schema={[
          articleSchema({
            path: `/research/${entry.slug}`,
            title: entry.title,
            description: articleDescription,
            publishedTime: entry.date,
            keywords: [...entry.tags, ...(pdfSignals?.keywords ?? [])],
            articleBody: pdfSignals?.articleBody,
            type: "Article"
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Research", path: "/research" },
            { name: entry.title, path: `/research/${entry.slug}` }
          ])
        ]}
      />

      <article className="py-14 sm:py-16">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-8">
            <header className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8">
              <PageBackButton iconOnly />
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.24em] text-accent">Research</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-xs ${statusClass(entry.status)}`}>
                  {statusLabel(entry.status)}
                </span>
                <span className="rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary">
                  {formatDate(entry.date)}
                </span>
                <span className="rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary">
                  {entry.venue}
                </span>
              </div>
              <h1 className="mt-4 font-heading text-4xl leading-tight sm:text-5xl">{entry.title}</h1>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">{entry.summary}</p>
            </header>

            {entry.laptopImage && entry.mobileImage ? (
              <DeviceMockupShowcase
                laptopImage={entry.laptopImage}
                mobileImage={entry.mobileImage}
                alt={entry.mockupAlt || entry.title}
                caption={entry.mockupCaption}
                mobileSide={entry.mockupMobileSide}
              />
            ) : null}

            <section className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-border bg-surface-card p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Abstract</p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{entry.abstract}</p>
              </article>
              <article className="rounded-2xl border border-border bg-surface-card p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Contribution</p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{entry.contribution}</p>
              </article>
            </section>

            <section className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8">
              <div className="prose prose-invert max-w-none">{content}</div>
            </section>

            <InsightsAIPanel
              kind="research"
              slug={entry.slug}
              title={entry.title}
              heading="Ask AI about this research entry"
              helperText="Use grounded AI to summarize this entry, extract key points, or get a simple explanation."
            />

            {entry.links?.pdf ? (
              <DocumentShowcase
                label="Research Document"
                title="Paper view and downloadable PDF"
                description="Publication-style PDF presentation for review, sharing, and search-friendly content depth."
                pdfUrl={entry.links.pdf}
                seoSignals={pdfSignals}
              />
            ) : null}

            {previous || next ? (
              <nav className="grid gap-3 sm:grid-cols-2">
                {previous ? (
                  <Link
                    href={`/research/${previous.slug}`}
                    className="rounded-2xl border border-border bg-surface-card p-4 transition hover:border-accent/35"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Previous Research</p>
                    <p className="mt-1 font-heading text-lg">{previous.title}</p>
                  </Link>
                ) : (
                  <div />
                )}
                {next ? (
                  <Link
                    href={`/research/${next.slug}`}
                    className="rounded-2xl border border-border bg-surface-card p-4 transition hover:border-accent/35"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Next Research</p>
                    <p className="mt-1 font-heading text-lg">{next.title}</p>
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <TableOfContents headings={headings} />

            <section className="rounded-2xl border border-border bg-surface-card p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">Quick Facts</p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>Status: {statusLabel(entry.status)}</li>
                <li>Date: {formatDate(entry.date)}</li>
                <li>Venue: {entry.venue}</li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {(entry.links?.pdf || entry.links?.doi || entry.links?.external) ? (
              <section className="rounded-2xl border border-border bg-surface-card p-4">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">Resources</p>
                <div className="flex flex-wrap gap-2">
                  {entry.links?.pdf ? (
                    <ButtonLink href={entry.links.pdf} variant="secondary" external className="px-3 py-1.5 text-xs">
                      Open PDF
                    </ButtonLink>
                  ) : null}
                  {entry.links?.doi ? (
                    <ButtonLink href={entry.links.doi} variant="secondary" external className="px-3 py-1.5 text-xs">
                      DOI
                    </ButtonLink>
                  ) : null}
                  {entry.links?.external ? (
                    <ButtonLink
                      href={entry.links.external}
                      variant="secondary"
                      external
                      className="px-3 py-1.5 text-xs"
                    >
                      External Link
                    </ButtonLink>
                  ) : null}
                </div>
              </section>
            ) : null}

            {relatedResearch.length > 0 ? (
              <section className="rounded-2xl border border-border bg-surface-card p-4">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">Related Research</p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {relatedResearch.map((item) => (
                    <li key={item.slug}>
                      <Link className="hover:text-text-primary" href={`/research/${item.slug}`}>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {relatedCaseStudies.length > 0 ? (
              <section className="rounded-2xl border border-border bg-surface-card p-4">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">Related Case Studies</p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {relatedCaseStudies.map((item) => (
                    <li key={item.slug}>
                      <Link className="hover:text-text-primary" href={`/case-studies/${item.slug}`}>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </Container>
      </article>
    </>
  );
}
