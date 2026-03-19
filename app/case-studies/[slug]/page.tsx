import { notFound } from "next/navigation";

import { MdxArticle } from "@/components/mdx/mdx-article";
import { DocumentShowcase } from "@/components/ui/document-showcase";
import { SchemaScript } from "@/components/ui/schema-script";
import { getAllCaseStudies, getCaseStudyBySlug, renderMdx } from "@/lib/mdx";
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
  const description = pdfSignals?.summary
    ? `${entry.conclusion} ${pdfSignals.summary}`.slice(0, 300)
    : entry.conclusion;

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
  const content = await renderMdx(entry.content);
  const pdfSignals = await getPdfSeoSignals(entry.pdf);

  const articleDescription = pdfSignals?.summary
    ? `${entry.conclusion} ${pdfSignals.summary}`.slice(0, 300)
    : entry.conclusion;

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
      <MdxArticle
        eyebrow="Case Study"
        title={entry.title}
        meta={
          <div className="flex flex-wrap gap-4">
            <span>{formatDate(entry.date)}</span>
            <span>{entry.tags.join(" • ")}</span>
            {entry.pdf ? <span>PDF available</span> : null}
          </div>
        }
      >
        {content}

        {entry.pdf ? (
          <DocumentShowcase
            label="Case Study Document"
            title="Downloadable analysis document"
            description="This embedded document version helps recruiters and reviewers scan the case-study story quickly and gives search engines extra structured context."
            pdfUrl={entry.pdf}
            seoSignals={pdfSignals}
          />
        ) : null}
      </MdxArticle>
    </>
  );
}
