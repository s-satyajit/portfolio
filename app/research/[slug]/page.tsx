import { notFound } from "next/navigation";

import { MdxArticle } from "@/components/mdx/mdx-article";
import { DocumentShowcase } from "@/components/ui/document-showcase";
import { SchemaScript } from "@/components/ui/schema-script";
import { getAllResearchEntries, getResearchBySlug, renderMdx } from "@/lib/mdx";
import { getPdfSeoSignals } from "@/lib/pdf-seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

interface ResearchDetailPageProps {
  params: Promise<{ slug: string }>;
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
  const content = await renderMdx(entry.content);
  const pdfSignals = await getPdfSeoSignals(entry.links?.pdf);

  const articleDescription = pdfSignals?.summary
    ? `${entry.summary} ${pdfSignals.summary}`.slice(0, 300)
    : entry.summary;

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
      <MdxArticle
        eyebrow="Research"
        title={entry.title}
        meta={
          <div className="flex flex-wrap gap-4">
            <span>Status: {entry.status}</span>
            <span>{formatDate(entry.date)}</span>
            <span>{entry.venue}</span>
            {entry.links?.pdf ? <span>PDF available</span> : null}
          </div>
        }
      >
        {content}

        {entry.links?.pdf ? (
          <DocumentShowcase
            label="Research Document"
            title="Paper view and downloadable PDF"
            description="Keep a publication-style reference available for recruiters, peers, and search crawlers while preserving a clean reading experience."
            pdfUrl={entry.links.pdf}
            seoSignals={pdfSignals}
          />
        ) : null}
      </MdxArticle>
    </>
  );
}
