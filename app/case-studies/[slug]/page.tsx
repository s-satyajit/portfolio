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
  getCaseStudyBySlug,
  renderMdx
} from "@/lib/mdx";
import { getPdfSeoSignals } from "@/lib/pdf-seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

interface CaseStudyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entries = await getAllCaseStudies(true);
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: CaseStudyDetailPageProps) {
  const { slug } = await params;
  const entry = await getCaseStudyBySlug(slug);
  if (!entry) return {};

  const pdfSignals = await getPdfSeoSignals(entry.pdf);
  const summarySeed = entry.overview || entry.subtitle || entry.conclusion;
  const description = pdfSignals?.summary
    ? `${summarySeed} ${pdfSignals.summary}`.slice(0, 300)
    : summarySeed;

  return buildPageMetadata({
    title: entry.title,
    description,
    path: `/case-studies/${entry.slug}`,
    keywords: [...entry.tags, ...(pdfSignals?.keywords ?? [])],
    type: "article"
  });
}

export default async function CaseStudyDetailPage({ params }: CaseStudyDetailPageProps) {
  const { slug } = await params;
  const entry = await getCaseStudyBySlug(slug);
  if (!entry) notFound();

  const [content, allCaseStudies, allResearchEntries, pdfSignals] = await Promise.all([
    renderMdx(entry.content),
    getAllCaseStudies(true),
    getAllResearchEntries(true),
    getPdfSeoSignals(entry.pdf)
  ]);

  const headings = extractMdxHeadings(entry.content);

  const summarySeed = entry.overview || entry.subtitle || entry.conclusion;
  const articleDescription = pdfSignals?.summary
    ? `${summarySeed} ${pdfSignals.summary}`.slice(0, 300)
    : summarySeed;

  const sortedCaseStudies = [...allCaseStudies].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const currentIndex = sortedCaseStudies.findIndex((item) => item.slug === entry.slug);
  const previous = currentIndex >= 0 ? sortedCaseStudies[currentIndex + 1] : undefined;
  const next = currentIndex > 0 ? sortedCaseStudies[currentIndex - 1] : undefined;
  const focusArea = entry.focusArea || entry.toolsOrMethods?.[0] || entry.tags[0] || "System analysis";

  const relatedCaseStudies = sortedCaseStudies
    .filter((item) => item.slug !== entry.slug)
    .filter((item) => item.tags.some((tag) => entry.tags.includes(tag)))
    .slice(0, 3);

  const relatedResearch = allResearchEntries
    .filter((item) => item.tags.some((tag) => entry.tags.includes(tag)))
    .slice(0, 3);

  return (
    <>
      <SchemaScript
        schema={[
          articleSchema({
            path: `/case-studies/${entry.slug}`,
            title: entry.title,
            description: articleDescription,
            publishedTime: entry.date,
            keywords: [...entry.tags, ...(pdfSignals?.keywords ?? [])],
            articleBody: pdfSignals?.articleBody,
            type: "Article"
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Case Studies", path: "/case-studies" },
            { name: entry.title, path: `/case-studies/${entry.slug}` }
          ])
        ]}
      />

      <article className="py-14 sm:py-16">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-8">
            <header className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8">
              <PageBackButton iconOnly />
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.24em] text-accent">Case Study</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary">
                  {formatDate(entry.date)}
                </span>
                <span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-xs text-accent">
                  Product + System Analysis
                </span>
                <span className="rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary">
                  Focus: {focusArea}
                </span>
                {entry.pdf ? (
                  <span className="rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary">
                    PDF source linked
                  </span>
                ) : null}
              </div>
              <h1 className="mt-4 font-heading text-4xl leading-tight sm:text-5xl">{entry.title}</h1>
              {entry.subtitle ? <p className="mt-3 text-lg text-text-secondary">{entry.subtitle}</p> : null}
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">{entry.overview || entry.context}</p>
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
              <article className="rounded-2xl border border-border bg-surface-card p-5 sm:col-span-2">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Overview</p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{entry.overview || entry.context}</p>
              </article>
              <article className="rounded-2xl border border-border bg-surface-card p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Context</p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{entry.context}</p>
              </article>
              <article className="rounded-2xl border border-border bg-surface-card p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Problem</p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{entry.problem}</p>
              </article>
              <article className="rounded-2xl border border-border bg-surface-card p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Approach</p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {entry.approach || entry.analysis}
                </p>
              </article>
              <article className="rounded-2xl border border-border bg-surface-card p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Conclusion</p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{entry.conclusion}</p>
              </article>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-border bg-surface-card p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Key Insights</p>
                <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                  {entry.keyInsights.map((insight) => (
                    <li key={insight}>- {insight}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-2xl border border-border bg-surface-card p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">What I Learned</p>
                <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                  {entry.learnings.map((learning) => (
                    <li key={learning}>- {learning}</li>
                  ))}
                </ul>
              </article>
              {entry.nextIteration?.length ? (
                <article className="rounded-2xl border border-border bg-surface-card p-5 sm:col-span-2">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Next Iteration</p>
                  <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                    {entry.nextIteration.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </article>
              ) : null}
            </section>

            {entry.toolsOrMethods?.length ? (
              <section className="rounded-2xl border border-border bg-surface-card p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Tools / Methods</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.toolsOrMethods.map((method) => (
                    <span key={method} className="rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary">
                      {method}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Detailed Breakdown</p>
              <div className="prose prose-invert mt-4 max-w-none">{content}</div>
            </section>

            {entry.pdf ? (
              <DocumentShowcase
                label="Source Document"
                title="Read the full case study PDF"
                description="Written summary and insights above are the primary portfolio view. Use the PDF below as supporting depth, references, and original report context."
                pdfUrl={entry.pdf}
                seoSignals={pdfSignals}
                sourceLinks={entry.pdfReferences}
                previewEnabled
                defaultPreviewOpen
                previewLabel="Toggle PDF Preview"
                compact
              />
            ) : null}

            <InsightsAIPanel
              kind="case-study"
              slug={entry.slug}
              title={entry.title}
              heading="Ask AI about this case study"
              helperText="Use grounded AI to inspect decision tradeoffs, key lessons, and implementation implications."
            />

            {previous || next ? (
              <nav className="grid gap-3 sm:grid-cols-2">
                {previous ? (
                  <Link
                    href={`/case-studies/${previous.slug}`}
                    className="rounded-2xl border border-border bg-surface-card p-4 transition hover:border-accent/35"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Previous Case Study</p>
                    <p className="mt-1 font-heading text-lg">{previous.title}</p>
                  </Link>
                ) : (
                  <div />
                )}
                {next ? (
                  <Link
                    href={`/case-studies/${next.slug}`}
                    className="rounded-2xl border border-border bg-surface-card p-4 transition hover:border-accent/35"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Next Case Study</p>
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
                <li>Date: {formatDate(entry.date)}</li>
                <li>Focus: {focusArea}</li>
                <li>Insights: {entry.keyInsights.length}</li>
                <li>Learnings: {entry.learnings.length}</li>
                {entry.nextIteration?.length ? <li>Next Steps: {entry.nextIteration.length}</li> : null}
                {entry.toolsOrMethods?.length ? <li>Methods: {entry.toolsOrMethods.length}</li> : null}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {entry.pdf ? (
              <section className="rounded-2xl border border-border bg-surface-card p-4">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">Document</p>
                <ButtonLink href={entry.pdf} variant="secondary" external className="px-3 py-1.5 text-xs">
                  Open PDF
                </ButtonLink>
                {entry.pdfReferences?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.pdfReferences.map((source) => (
                      <ButtonLink
                        key={source.href}
                        href={source.href}
                        variant="secondary"
                        external
                        className="px-3 py-1.5 text-xs"
                      >
                        {source.label}
                      </ButtonLink>
                    ))}
                  </div>
                ) : null}
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
          </aside>
        </Container>
      </article>
    </>
  );
}
