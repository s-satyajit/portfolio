import { Suspense } from "react";

import { BlogListingClient } from "@/components/blog/blog-listing-client";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/ui/page-header";
import { buildPageMetadata } from "@/lib/seo";
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
      <PageHeader
        eyebrow="Blog / Insights"
        title="Technical writing, engineering notes, and practical AI insights"
        description="A premium reading experience focused on implementation decisions, product tradeoffs, and applied systems thinking."
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
      </Container>
    </>
  );
}
