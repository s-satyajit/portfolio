"use client";

import { LayoutGrid, List, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { BlogCard } from "@/components/blog/blog-card";
import { FeaturedPostCard } from "@/components/blog/featured-post-card";
import { formatAudience, formatDifficulty, parseReadMinutes } from "@/lib/blog-utils";
import { cn, formatDate } from "@/lib/utils";
import { BlogFrontmatter } from "@/types/blog";

type SortKey = "newest" | "oldest" | "title" | "read-high" | "read-low";
type ViewMode = "cards" | "list";
type ReadBand = "all" | "quick" | "standard" | "deep";
type AudienceFilter = "all" | NonNullable<BlogFrontmatter["audience"]>;
type DifficultyFilter = "all" | NonNullable<BlogFrontmatter["difficulty"]>;

interface BlogListingClientProps {
  posts: BlogFrontmatter[];
}

interface OptionItem {
  value: string;
  label: string;
}

interface ReadingPath {
  id: string;
  title: string;
  description: string;
  apply: {
    audience?: AudienceFilter;
    tag?: string;
    sort?: SortKey;
    readBand?: ReadBand;
  };
}

const readingPaths: ReadingPath[] = [
  {
    id: "recruiter-fast",
    title: "Recruiter Fast Scan",
    description: "Shortlist high-signal posts that map quickly to shipped engineering capability.",
    apply: { audience: "recruiter", sort: "newest", readBand: "quick" }
  },
  {
    id: "ai-engineering",
    title: "AI Engineering Track",
    description: "Focus on applied AI posts with implementation and trust-oriented patterns.",
    apply: { tag: "ai-engineering", sort: "newest", readBand: "standard" }
  },
  {
    id: "architecture-depth",
    title: "Architecture Depth",
    description: "Longer-form thinking around tradeoffs, system clarity, and implementation strategy.",
    apply: { audience: "engineer", sort: "read-high", readBand: "deep" }
  }
];

function normalized(text: string): string {
  return text.toLowerCase().trim();
}

function toReadableLabel(text: string): string {
  return text
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function optionList(values: string[], fallbackLabel: (value: string) => string): OptionItem[] {
  return values.map((value) => ({
    value,
    label: value === "all" ? "All" : fallbackLabel(value)
  }));
}

function readBandLabel(value: ReadBand): string {
  if (value === "quick") return "Quick Read (< 6 min)";
  if (value === "standard") return "Standard (6-10 min)";
  if (value === "deep") return "Deep Dive (10+ min)";
  return "All Read Lengths";
}

function readBandMatches(post: BlogFrontmatter, readBand: ReadBand): boolean {
  if (readBand === "all") return true;
  const minutes = parseReadMinutes(post.readTime);
  if (!minutes) return true;
  if (readBand === "quick") return minutes < 6;
  if (readBand === "standard") return minutes >= 6 && minutes <= 10;
  return minutes > 10;
}

function BlogListRow({ post }: { post: BlogFrontmatter }) {
  return (
    <article className="grid gap-3 rounded-2xl border border-border bg-surface-card p-4 transition hover:border-accent/35 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
          <span>{formatDate(post.date)}</span>
          {post.readTime ? (
            <>
              <span>|</span>
              <span>{post.readTime}</span>
            </>
          ) : null}
          {post.category ? (
            <>
              <span>|</span>
              <span>{toReadableLabel(post.category)}</span>
            </>
          ) : null}
          {post.difficulty ? (
            <>
              <span>|</span>
              <span>{formatDifficulty(post.difficulty)}</span>
            </>
          ) : null}
        </div>
        <h3 className="mt-2 font-heading text-xl leading-tight">
          <Link href={`/blog/${post.slug}`} className="transition hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-text-secondary">{post.excerpt}</p>
      </div>
      <Link
        href={`/blog/${post.slug}`}
        className="inline-flex items-center rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
      >
        Read
      </Link>
    </article>
  );
}

export function BlogListingClient({ posts }: BlogListingClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [search, setSearch] = useState(() => searchParams.get("query") || "");
  const [selectedTag, setSelectedTag] = useState(() => normalized(searchParams.get("tag") || "all"));
  const [selectedCategory, setSelectedCategory] = useState(
    () => normalized(searchParams.get("category") || "all")
  );
  const [selectedAudience, setSelectedAudience] = useState<AudienceFilter>(() => {
    const initial = normalized(searchParams.get("audience") || "all");
    return (["all", "recruiter", "engineer", "client", "general"].includes(initial)
      ? initial
      : "all") as AudienceFilter;
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>(() => {
    const initial = normalized(searchParams.get("difficulty") || "all");
    return (["all", "beginner", "intermediate", "advanced"].includes(initial)
      ? initial
      : "all") as DifficultyFilter;
  });
  const [readBand, setReadBand] = useState<ReadBand>(() => {
    const initial = normalized(searchParams.get("readBand") || "all");
    return (["all", "quick", "standard", "deep"].includes(initial) ? initial : "all") as ReadBand;
  });
  const [showDrafts, setShowDrafts] = useState(() => searchParams.get("drafts") !== "hide");
  const [sort, setSort] = useState<SortKey>(() => {
    const initial = normalized(searchParams.get("sort") || "newest");
    return (["newest", "oldest", "title", "read-high", "read-low"].includes(initial)
      ? initial
      : "newest") as SortKey;
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const initial = normalized(searchParams.get("view") || "cards");
    return (initial === "list" ? "list" : "cards") as ViewMode;
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/") return;
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      event.preventDefault();
      searchInputRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("query", search.trim());
    if (selectedTag !== "all") params.set("tag", selectedTag);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedAudience !== "all") params.set("audience", selectedAudience);
    if (selectedDifficulty !== "all") params.set("difficulty", selectedDifficulty);
    if (readBand !== "all") params.set("readBand", readBand);
    if (!showDrafts) params.set("drafts", "hide");
    if (sort !== "newest") params.set("sort", sort);
    if (viewMode !== "cards") params.set("view", viewMode);

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [
    pathname,
    readBand,
    router,
    search,
    selectedAudience,
    selectedCategory,
    selectedDifficulty,
    selectedTag,
    showDrafts,
    sort,
    viewMode
  ]);

  const tags = useMemo(() => {
    const unique = Array.from(new Set(posts.flatMap((post) => post.tags.map((tag) => normalized(tag)))));
    return optionList(["all", ...unique.sort()], (value) => toReadableLabel(value));
  }, [posts]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(posts.map((post) => normalized(post.category || "uncategorized"))));
    return optionList(["all", ...unique.sort()], (value) => toReadableLabel(value));
  }, [posts]);

  const audiences = useMemo(() => {
    const uniqueAudiences = Array.from(
      new Set(posts.map((post) => post.audience).filter(Boolean))
    ) as string[];

    return optionList(
      ["all", ...uniqueAudiences],
      (value) => formatAudience(value as BlogFrontmatter["audience"])
    );
  }, [posts]);

  const difficulties = useMemo(() => {
    const uniqueDifficulties = Array.from(
      new Set(posts.map((post) => post.difficulty).filter(Boolean))
    ) as string[];

    return optionList(
      ["all", ...uniqueDifficulties],
      (value) => formatDifficulty(value as BlogFrontmatter["difficulty"])
    );
  }, [posts]);

  const filtered = useMemo(() => {
    const term = normalized(search);

    const next = posts.filter((post) => {
      if (!showDrafts && post.draft) return false;

      const matchesSearch =
        !term ||
        normalized(post.title).includes(term) ||
        normalized(post.excerpt).includes(term) ||
        normalized(post.tags.join(" ")).includes(term) ||
        normalized(post.subtitle || "").includes(term);

      const matchesTag = selectedTag === "all" || post.tags.some((tag) => normalized(tag) === selectedTag);
      const category = normalized(post.category || "uncategorized");
      const matchesCategory = selectedCategory === "all" || category === selectedCategory;
      const matchesAudience = selectedAudience === "all" || post.audience === selectedAudience;
      const matchesDifficulty = selectedDifficulty === "all" || post.difficulty === selectedDifficulty;
      const matchesReadBand = readBandMatches(post, readBand);

      return (
        matchesSearch &&
        matchesTag &&
        matchesCategory &&
        matchesAudience &&
        matchesDifficulty &&
        matchesReadBand
      );
    });

    return next.sort((a, b) => {
      if (sort === "oldest") return +new Date(a.date) - +new Date(b.date);
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "read-high") return (parseReadMinutes(b.readTime) || 0) - (parseReadMinutes(a.readTime) || 0);
      if (sort === "read-low") return (parseReadMinutes(a.readTime) || 0) - (parseReadMinutes(b.readTime) || 0);
      return +new Date(b.date) - +new Date(a.date);
    });
  }, [posts, readBand, search, selectedAudience, selectedCategory, selectedDifficulty, selectedTag, showDrafts, sort]);

  const publishedCount = useMemo(() => posts.filter((post) => !post.draft).length, [posts]);
  const uniqueTopics = useMemo(() => new Set(posts.flatMap((post) => post.tags)).size, [posts]);
  const totalReadMinutes = useMemo(
    () => posts.reduce((sum, post) => sum + (parseReadMinutes(post.readTime) || 0), 0),
    [posts]
  );
  const avgRead = useMemo(() => {
    if (!posts.length) return 0;
    return Math.round(totalReadMinutes / posts.length);
  }, [posts.length, totalReadMinutes]);

  const featuredPool = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => {
      const featuredDelta = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      if (featuredDelta !== 0) return featuredDelta;

      const rankA = a.featuredRank || 999;
      const rankB = b.featuredRank || 999;
      if (rankA !== rankB) return rankA - rankB;

      return +new Date(b.date) - +new Date(a.date);
    });
    return sorted;
  }, [filtered]);

  const featured = featuredPool[0];
  const secondaryFeatured = featuredPool.filter((post) => post.slug !== featured?.slug).slice(0, 2);
  const results = filtered.filter((post) => post.slug !== featured?.slug);

  const activeFilterCount =
    Number(Boolean(search.trim())) +
    Number(selectedTag !== "all") +
    Number(selectedCategory !== "all") +
    Number(selectedAudience !== "all") +
    Number(selectedDifficulty !== "all") +
    Number(readBand !== "all") +
    Number(!showDrafts);

  function resetFilters() {
    setSearch("");
    setSelectedTag("all");
    setSelectedCategory("all");
    setSelectedAudience("all");
    setSelectedDifficulty("all");
    setReadBand("all");
    setShowDrafts(true);
    setSort("newest");
  }

  return (
    <div className="space-y-8 pb-20">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-2xl border border-border bg-surface-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Total Posts</p>
          <p className="mt-2 font-heading text-2xl">{posts.length}</p>
          <p className="mt-1 text-xs text-text-secondary">Complete long-form writing library</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Published</p>
          <p className="mt-2 font-heading text-2xl">{publishedCount}</p>
          <p className="mt-1 text-xs text-text-secondary">Public and index-ready pieces</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Topics</p>
          <p className="mt-2 font-heading text-2xl">{uniqueTopics}</p>
          <p className="mt-1 text-xs text-text-secondary">Distinct engineering themes</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Avg Read Time</p>
          <p className="mt-2 font-heading text-2xl">{avgRead} min</p>
          <p className="mt-1 text-xs text-text-secondary">Designed for practical reading flow</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Current Results</p>
          <p className="mt-2 font-heading text-2xl">{filtered.length}</p>
          <p className="mt-1 text-xs text-text-secondary">After active search + filter controls</p>
        </article>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {readingPaths.map((path) => (
          <article key={path.id} className="rounded-2xl border border-border bg-surface-card p-4">
            <p className="font-heading text-lg">{path.title}</p>
            <p className="mt-2 text-sm text-text-secondary">{path.description}</p>
            <button
              type="button"
              onClick={() => {
                setSelectedAudience(path.apply.audience || "all");
                setSelectedTag(path.apply.tag || "all");
                setSort(path.apply.sort || "newest");
                setReadBand(path.apply.readBand || "all");
              }}
              className="mt-4 inline-flex rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
            >
              Apply Path
            </button>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-surface-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            <Sparkles size={14} />
            Blog Command Center
          </p>
          <p className="text-xs text-text-secondary">
            {filtered.length} article{filtered.length === 1 ? "" : "s"}
            {activeFilterCount > 0 ? ` - ${activeFilterCount} active filter${activeFilterCount > 1 ? "s" : ""}` : ""}
          </p>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_220px]">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
            <Search size={16} className="text-text-secondary" />
            <input
              ref={searchInputRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, excerpt, tags...  (Press /)"
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
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
                <option key={tag.value} value={tag.value}>
                  {tag.value === "all" ? "All Tags" : tag.label}
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
                <option key={category.value} value={category.value}>
                  {category.value === "all" ? "All Categories" : category.label}
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
              <option value="read-high">Longest Read First</option>
              <option value="read-low">Shortest Read First</option>
            </select>
          </label>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <label className="text-sm text-text-secondary">
            Audience
            <select
              value={selectedAudience}
              onChange={(event) => setSelectedAudience(event.target.value as AudienceFilter)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            >
              {audiences.map((audience) => (
                <option key={audience.value} value={audience.value}>
                  {audience.value === "all" ? "All Audiences" : audience.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-text-secondary">
            Difficulty
            <select
              value={selectedDifficulty}
              onChange={(event) => setSelectedDifficulty(event.target.value as DifficultyFilter)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.value === "all" ? "All Levels" : difficulty.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-text-secondary">
            Read Length
            <select
              value={readBand}
              onChange={(event) => setReadBand(event.target.value as ReadBand)}
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            >
              {(["all", "quick", "standard", "deep"] as const).map((option) => (
                <option key={option} value={option}>
                  {readBandLabel(option)}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowDrafts((prev) => !prev)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition",
                showDrafts
                  ? "border-accent/35 bg-accent-soft text-accent"
                  : "border-border text-text-secondary hover:border-accent/35 hover:text-text-primary"
              )}
            >
              {showDrafts ? "Drafts Visible" : "Drafts Hidden"}
            </button>

            <div className="flex items-center rounded-full border border-border bg-surface p-1">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs transition",
                  viewMode === "cards"
                    ? "bg-accent-soft text-accent"
                    : "text-text-secondary hover:text-text-primary"
                )}
                aria-label="Card view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs transition",
                  viewMode === "list"
                    ? "bg-accent-soft text-accent"
                    : "text-text-secondary hover:text-text-primary"
                )}
                aria-label="List view"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {activeFilterCount > 0 ? (
          <div className="mt-3">
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
            >
              Reset Filters
            </button>
          </div>
        ) : null}
      </section>

      {featured ? (
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <FeaturedPostCard post={featured} />

          <div className="space-y-4">
            {secondaryFeatured.map((post) => (
              <article key={post.slug} className="rounded-2xl border border-border bg-surface-card p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Spotlight</p>
                <h3 className="mt-2 font-heading text-xl leading-tight">
                  <Link href={`/blog/${post.slug}`} className="transition hover:text-accent">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-text-secondary">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {results.length > 0 ? (
        viewMode === "cards" ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </section>
        ) : (
          <section className="space-y-3">
            {results.map((post) => (
              <BlogListRow key={post.slug} post={post} />
            ))}
          </section>
        )
      ) : (
        <section className="rounded-2xl border border-border bg-surface-card p-6 text-center">
          <p className="font-heading text-xl">No posts matched your filters.</p>
          <p className="mt-2 text-sm text-text-secondary">Try a different tag, audience, or read-length selection.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
          >
            Reset and Show All
          </button>
        </section>
      )}
    </div>
  );
}


