import Link from "next/link";
import { notFound } from "next/navigation";

import { AboutAuthor } from "@/components/blog/about-author";
import { ArticleAIPanel } from "@/components/blog/article-ai-panel";
import { ArticleEndCta } from "@/components/blog/article-end-cta";
import { BlogHero } from "@/components/blog/blog-hero";
import { PrevNextNav } from "@/components/blog/prev-next-nav";
import { ProjectMentionCard } from "@/components/blog/project-mention-card";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Container } from "@/components/layout/container";
import { SchemaScript } from "@/components/ui/schema-script";
import { authorProfile } from "@/data/author";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import {
  extractBlogHeadings,
  getAllBlogPosts,
  getAllCaseStudies,
  getAllResearchEntries,
  getBlogPostBySlug,
  renderMdx
} from "@/lib/mdx";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts(true);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    ...buildPageMetadata({
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      path: `/blog/${post.slug}`,
      image: post.cover,
      type: "article"
    }),
    authors: [{ name: authorProfile.name, url: absoluteUrl(authorProfile.aboutUrl) }],
    category: post.category,
    robots: {
      index: !post.draft,
      follow: true
    }
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const [content, allPosts, caseStudies, researchEntries] = await Promise.all([
    renderMdx(post.content),
    getAllBlogPosts(true),
    getAllCaseStudies(true),
    getAllResearchEntries(true)
  ]);

  const headings = extractBlogHeadings(post.content);
  const sortedPosts = [...allPosts].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const index = sortedPosts.findIndex((entry) => entry.slug === post.slug);
  const previous = index >= 0 ? sortedPosts[index + 1] : undefined;
  const next = index > 0 ? sortedPosts[index - 1] : undefined;

  const relatedPosts = allPosts
    .filter((entry) => entry.slug !== post.slug)
    .filter((entry) => entry.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);

  const relatedCaseStudies = caseStudies
    .filter((entry) => entry.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 2);

  const relatedResearch = researchEntries
    .filter((entry) => entry.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 2);

  return (
    <>
      <ReadingProgress />
      <SchemaScript
        schema={[
          articleSchema({
            path: `/blog/${post.slug}`,
            title: post.title,
            description: post.excerpt,
            publishedTime: post.date,
            modifiedTime: post.date,
            keywords: post.tags,
            image: post.cover,
            type: "BlogPosting"
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` }
          ])
        ]}
      />

      <article className="py-14 sm:py-16">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-8">
            <BlogHero
              title={post.title}
              subtitle={post.subtitle}
              excerpt={post.excerpt}
              tags={post.tags}
              meta={
                <>
                  <span>{formatDate(post.date)}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                  {post.category ? (
                    <>
                      <span>•</span>
                      <span>{post.category}</span>
                    </>
                  ) : null}
                  {post.draft ? (
                    <>
                      <span>•</span>
                      <span>Draft</span>
                    </>
                  ) : null}
                </>
              }
            />

            <div className="prose prose-invert max-w-none rounded-2xl border border-border bg-surface-card p-6 sm:p-8">
              {content}
            </div>

            <ProjectMentionCard slugs={post.projectMentions || []} />
            <ArticleAIPanel slug={post.slug} />
            <AboutAuthor />
            <ArticleEndCta />
            <PrevNextNav previous={previous} next={next} />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <TableOfContents headings={headings} />

            {relatedPosts.length > 0 ? (
              <section className="rounded-2xl border border-border bg-surface-card p-4">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  Related Posts
                </p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {relatedPosts.map((entry) => (
                    <li key={entry.slug}>
                      <Link className="hover:text-text-primary" href={`/blog/${entry.slug}`}>
                        {entry.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {relatedCaseStudies.length > 0 || relatedResearch.length > 0 ? (
              <section className="rounded-2xl border border-border bg-surface-card p-4">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  Next Read
                </p>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {relatedCaseStudies.map((entry) => (
                    <li key={entry.slug}>
                      <Link className="hover:text-text-primary" href={`/case-studies/${entry.slug}`}>
                        Case Study: {entry.title}
                      </Link>
                    </li>
                  ))}
                  {relatedResearch.map((entry) => (
                    <li key={entry.slug}>
                      <Link className="hover:text-text-primary" href={`/research/${entry.slug}`}>
                        Research: {entry.title}
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
