import { Suspense } from "react";

import { ContextualAIAssistant } from "@/components/ai/contextual-ai-assistant";
import { BlogListingClient } from "@/components/blog/blog-listing-client";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { SchemaScript } from "@/components/ui/schema-script";
import { buildPageMetadata } from "@/lib/seo";
import { blogCollectionSchema } from "@/lib/schema";
import { getAllBlogPosts } from "@/lib/mdx";

export const metadata = buildPageMetadata({
  title: "Blog",
  description:
    "AI engineering insights, full-stack implementation notes, and product-minded writing by Satyajit Samal.",
  path: "/blog"
});

export default async function BlogPage() {
  const posts = await getAllBlogPosts(true);

  return (
    <>
      <SchemaScript
        schema={blogCollectionSchema(
          posts.map((post) => ({
            title: post.title,
            path: `/blog/${post.slug}`,
            description: post.excerpt,
            date: post.date
          }))
        )}
      />
      <PageHeader
        eyebrow="Blog / Insights"
        title="Technical writing engineered as a premium knowledge product"
        description="Explore implementation notes, AI integration learnings, architecture decisions, and recruiter-relevant technical communication."
        actions={
          <>
            <ButtonLink href="/insights" variant="secondary">
              Open Insights Hub
            </ButtonLink>
            <ButtonLink href="/projects" variant="secondary">
              Link Writing to Projects
            </ButtonLink>
          </>
        }
      />
      <Container>
        <Suspense
          fallback={
            <div className="rounded-2xl border border-border bg-surface-card p-6 text-sm text-text-secondary">
              Loading blog explorer...
            </div>
          }
        >
          <BlogListingClient posts={posts} />
        </Suspense>

        <div className="pb-20">
          <ContextualAIAssistant
            mode="homepage"
            heading="Ask AI to navigate my writing"
            helperText="Get a quick recommendation on which article to read first based on your role and interest."
            suggestedPrompts={[
              "Which blog post should a recruiter read first?",
              "Which article best reflects AI implementation thinking?",
              "Which post is most useful for frontend or full-stack roles?",
              "What should a client read before contacting?"
            ]}
            className="bg-surface-card"
            compact
          />
        </div>
      </Container>
    </>
  );
}
