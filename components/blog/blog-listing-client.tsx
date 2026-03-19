"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { BlogCard } from "@/components/blog/blog-card";
import { FeaturedPostCard } from "@/components/blog/featured-post-card";
import { BlogFrontmatter } from "@/types/blog";

type SortKey = "newest" | "oldest" | "title";

interface BlogListingClientProps {
  posts: BlogFrontmatter[];
}

function normalized(text: string): string {
  return text.toLowerCase().trim();
}

export function BlogListingClient({ posts }: BlogListingClientProps) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("query") || "");
  const [selectedTag, setSelectedTag] = useState(
    () => normalized(searchParams.get("tag") || "all")
  );
  const [selectedCategory, setSelectedCategory] = useState(
    () => normalized(searchParams.get("category") || "all")
  );
  const [sort, setSort] = useState<SortKey>("newest");

  const tags = useMemo(
    () =>
      ["all", ...new Set(posts.flatMap((post) => post.tags.map((tag) => normalized(tag))))],
    [posts]
  );

  const categories = useMemo(
    () =>
      ["all", ...new Set(posts.map((post) => normalized(post.category || "uncategorized")))],
    [posts]
  );

  const filtered = useMemo(() => {
    const term = normalized(search);
    const next = posts.filter((post) => {
      const matchesSearch =
        !term ||
        normalized(post.title).includes(term) ||
        normalized(post.excerpt).includes(term) ||
        normalized(post.tags.join(" ")).includes(term) ||
        normalized(post.subtitle || "").includes(term);

      const matchesTag =
        selectedTag === "all" || post.tags.some((tag) => normalized(tag) === selectedTag);

      const category = normalized(post.category || "uncategorized");
      const matchesCategory = selectedCategory === "all" || category === selectedCategory;

      return matchesSearch && matchesTag && matchesCategory;
    });

    return next.sort((a, b) => {
      if (sort === "oldest") return +new Date(a.date) - +new Date(b.date);
      if (sort === "title") return a.title.localeCompare(b.title);
      return +new Date(b.date) - +new Date(a.date);
    });
  }, [posts, search, selectedTag, selectedCategory, sort]);

  const featured = useMemo(
    () => filtered.find((post) => post.featured) || filtered[0],
    [filtered]
  );
  const gridPosts = useMemo(
    () => filtered.filter((post) => post.slug !== featured?.slug),
    [filtered, featured]
  );

  return (
    <div className="space-y-8 pb-20">
      {featured ? <FeaturedPostCard post={featured} /> : null}

      <section className="rounded-2xl border border-border bg-surface-card p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
          <label className="text-sm text-text-secondary">
            Search
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, excerpt, or tag..."
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            />
          </label>

          <label className="text-sm text-text-secondary">
            Tag
            <select
              value={selectedTag}
              onChange={(event) => setSelectedTag(event.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            >
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-text-secondary">
            Category
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-text-secondary">
            Sort
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A-Z</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-text-secondary">
          Showing {filtered.length} article{filtered.length === 1 ? "" : "s"}
        </p>
      </section>

      {gridPosts.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-border bg-surface-card p-6 text-center text-sm text-text-secondary">
          No posts match your current search/filter. Try clearing one filter.
        </section>
      )}
    </div>
  );
}
