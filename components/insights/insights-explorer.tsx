"use client";

import Link from "next/link";
import { Grid2x2, Search, SlidersHorizontal, Sparkles, StretchHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { InsightItem, InsightKind } from "@/types/insights";
import { getUniqueTags } from "@/lib/insights";
import { cn, formatDate } from "@/lib/utils";

type ExplorerMode = "all" | InsightKind;
type SortMode = "newest" | "oldest" | "title";
type ViewMode = "spotlight" | "grid";
type ResearchStatusFilter = "all" | "published" | "accepted" | "under-review" | "preprint" | "in-preparation";

interface InsightsExplorerProps {
  items: InsightItem[];
  mode?: ExplorerMode;
  heading?: string;
  helperText?: string;
}

const statusOrder: ResearchStatusFilter[] = [
  "all",
  "published",
  "accepted",
  "under-review",
  "preprint",
  "in-preparation"
];

function insightHref(item: InsightItem): string {
  return item.kind === "research" ? `/research/${item.slug}` : `/case-studies/${item.slug}`;
}

function kindLabel(kind: InsightKind): string {
  return kind === "research" ? "Research" : "Case Study";
}

function statusLabel(status: Exclude<ResearchStatusFilter, "all">): string {
  if (status === "under-review") return "Under Review";
  if (status === "in-preparation") return "In Preparation";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function researchStatusClass(status: Exclude<ResearchStatusFilter, "all">): string {
  if (status === "published") return "border-emerald-400/35 bg-emerald-500/10 text-emerald-200";
  if (status === "accepted") return "border-cyan-400/35 bg-cyan-500/10 text-cyan-200";
  if (status === "under-review") return "border-amber-400/35 bg-amber-500/10 text-amber-200";
  if (status === "preprint") return "border-violet-400/35 bg-violet-500/10 text-violet-200";
  return "border-border bg-surface text-text-secondary";
}

interface InsightCardProps {
  item: InsightItem;
  compact?: boolean;
}

function InsightCard({ item, compact = false }: InsightCardProps) {
  const href = insightHref(item);

  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-surface-card transition hover:border-accent/35",
        compact ? "p-4" : "p-5 sm:p-6"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-accent">
          {kindLabel(item.kind)}
        </span>
        {item.kind === "research" && item.pdf ? (
          <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-text-secondary">
            PDF Source
          </span>
        ) : null}
        {item.kind === "research" && item.status ? (
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]",
              researchStatusClass(item.status)
            )}
          >
            {statusLabel(item.status)}
          </span>
        ) : null}
      </div>

      <h3 className={cn("mt-3 font-heading leading-tight", compact ? "text-lg" : "text-2xl")}>
        <Link href={href} className="transition hover:text-accent">
          {item.title}
        </Link>
      </h3>
      {item.subtitle ? <p className="mt-1 text-sm text-text-secondary">{item.subtitle}</p> : null}

      <p className={cn("mt-2 text-text-secondary", compact ? "text-sm" : "text-sm leading-relaxed")}>
        {item.kind === "research" ? item.summary : item.overview || item.context || item.summary}
      </p>

      {item.kind === "research" ? (
        <div className="mt-3 rounded-xl border border-border bg-surface p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-accent">Contribution</p>
          <p className="mt-1 text-sm text-text-secondary">{item.contribution}</p>
        </div>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-accent">Theme</p>
            <p className="mt-1 text-sm text-text-secondary">
              {item.focusArea || item.tags.slice(0, 2).join(" | ") || "Applied system analysis"}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-accent">Insight Signal</p>
            <p className="mt-1 text-sm text-text-secondary">
              {item.keyInsights?.length
                ? `${item.keyInsights.length} key insight${item.keyInsights.length > 1 ? "s" : ""}`
                : item.conclusion}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, compact ? 3 : 5).map((tag) => (
            <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary">
              {tag}
            </span>
          ))}
        </div>

        <span className="text-xs text-text-secondary">{formatDate(item.date)}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={href}
          className="inline-flex items-center rounded-full border border-accent/35 bg-accent-soft px-4 py-2 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-surface"
        >
          Open {item.kind === "research" ? "Research" : "Case Study"}
        </Link>
        {item.kind === "research" && item.pdf ? (
          <a
            href={item.pdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
          >
            Open PDF
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function InsightsExplorer({
  items,
  mode = "all",
  heading = "Insights Explorer",
  helperText = "Search, filter, and sort research notes and case studies by relevance."
}: InsightsExplorerProps) {
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("spotlight");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [activeTag, setActiveTag] = useState<string>("all");
  const [activeKind, setActiveKind] = useState<ExplorerMode>(mode === "all" ? "all" : mode);
  const [researchStatus, setResearchStatus] = useState<ResearchStatusFilter>("all");

  const availableTags = useMemo(() => getUniqueTags(items), [items]);

  const metrics = useMemo(() => {
    const researchCount = items.filter((item) => item.kind === "research").length;
    const caseCount = items.filter((item) => item.kind === "case-study").length;
    const pdfCount = items.filter((item) => Boolean(item.pdf)).length;
    return [
      { label: "Total Insights", value: String(items.length), helper: "Research + case studies" },
      { label: "Research Notes", value: String(researchCount), helper: "Publication-track analysis" },
      { label: "Case Studies", value: String(caseCount), helper: "Architecture and product decisions" },
      { label: "PDF Documents", value: String(pdfCount), helper: "Downloadable references" }
    ];
  }, [items]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const visible = items.filter((item) => {
      if (mode !== "all" && item.kind !== mode) return false;
      if (activeKind !== "all" && item.kind !== activeKind) return false;

      if (researchStatus !== "all") {
        if (item.kind !== "research" || item.status !== researchStatus) return false;
      }

      if (activeTag !== "all" && !item.tags.includes(activeTag)) return false;

      if (!normalizedQuery) return true;

      const searchable = [
        item.title,
        item.summary,
        item.context,
        item.problem,
        item.contribution,
        item.conclusion,
        item.venue,
        ...item.tags
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });

    const sorted = [...visible];
    if (sortMode === "oldest") {
      sorted.sort((a, b) => +new Date(a.date) - +new Date(b.date));
    } else if (sortMode === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sorted.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    }
    return sorted;
  }, [activeKind, activeTag, items, mode, query, researchStatus, sortMode]);

  const activeFilterCount =
    Number(Boolean(query.trim())) +
    Number(activeTag !== "all") +
    Number(activeKind !== "all") +
    Number(researchStatus !== "all");

  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-border bg-surface-card p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">{metric.label}</p>
            <p className="mt-2 font-heading text-2xl">{metric.value}</p>
            <p className="mt-1 text-xs text-text-secondary">{metric.helper}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-border bg-surface-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            <Sparkles size={14} />
            {heading}
          </p>
          <p className="text-xs text-text-secondary">
            {filtered.length} shown
            {activeFilterCount > 0 ? ` - ${activeFilterCount} active filter${activeFilterCount > 1 ? "s" : ""}` : ""}
          </p>
        </div>

        <p className="mt-2 text-sm text-text-secondary">{helperText}</p>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
            <Search size={16} className="text-text-secondary" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by topic, title, tags, context, or contribution..."
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
              aria-label="Search insights"
            />
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
            <SlidersHorizontal size={14} className="text-text-secondary" />
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="w-full bg-transparent text-sm text-text-primary focus:outline-none"
              aria-label="Sort insights"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="title">Sort: Title</option>
            </select>
          </label>

          <div className="flex items-center rounded-xl border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setViewMode("spotlight")}
              className={cn(
                "flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs transition",
                viewMode === "spotlight"
                  ? "bg-accent-soft text-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
              aria-label="Spotlight view"
            >
              <StretchHorizontal size={14} />
              Spotlight
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs transition",
                viewMode === "grid"
                  ? "bg-accent-soft text-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
              aria-label="Grid view"
            >
              <Grid2x2 size={14} />
              Grid
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {mode === "all" ? (
            <>
              {(["all", "research", "case-study"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setActiveKind(option)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition",
                    activeKind === option
                      ? "border-accent/40 bg-accent-soft text-accent"
                      : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
                  )}
                >
                  {option === "all" ? "All Types" : kindLabel(option)}
                </button>
              ))}
            </>
          ) : null}

          {(activeKind === "all" || activeKind === "research" || mode === "research") &&
          items.some((item) => item.kind === "research") ? (
            <>
              {statusOrder.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setResearchStatus(status)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition",
                    researchStatus === status
                      ? "border-accent/40 bg-accent-soft text-accent"
                      : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
                  )}
                >
                  {status === "all" ? "All Research Status" : statusLabel(status)}
                </button>
              ))}
            </>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag("all")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition",
              activeTag === "all"
                ? "border-accent/40 bg-accent-soft text-accent"
                : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
            )}
          >
            All Tags
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition",
                activeTag === tag
                  ? "border-accent/40 bg-accent-soft text-accent"
                  : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
              )}
            >
              {tag}
            </button>
          ))}

          {activeFilterCount > 0 ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveTag("all");
                setResearchStatus("all");
                setActiveKind(mode === "all" ? "all" : mode);
                setSortMode("newest");
              }}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
            >
              Reset Filters
            </button>
          ) : null}
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-2xl border border-border bg-surface-card p-6 text-center">
          <p className="font-heading text-xl">No entries matched your current filters.</p>
          <p className="mt-2 text-sm text-text-secondary">Try changing a tag, status, or search term.</p>
        </section>
      ) : viewMode === "spotlight" ? (
        <section className="space-y-5">
          {filtered.map((item) => (
            <InsightCard key={`${item.kind}-${item.slug}`} item={item} />
          ))}
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <InsightCard key={`${item.kind}-${item.slug}`} item={item} compact />
          ))}
        </section>
      )}
    </div>
  );
}
