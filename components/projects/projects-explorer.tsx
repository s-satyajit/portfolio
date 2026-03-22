"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, List, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { Project } from "@/types/project";
import { compareProjectsByImpact, getProjectCategoryLabel, getProjectStatusLabel } from "@/lib/project-meta";
import { cn } from "@/lib/utils";

type SortKey = "impact" | "name-asc" | "name-desc" | "case-study-first";
type ViewMode = "spotlight" | "grid";

interface ProjectsExplorerProps {
  projects: Project[];
}

interface ProjectMetric {
  label: string;
  value: string;
  helper: string;
}

function getStatusBadgeClass(status: Project["status"]): string {
  if (status === "live") {
    return "border-emerald-400/35 bg-emerald-500/10 text-emerald-200";
  }

  if (status === "in-progress") {
    return "border-amber-400/35 bg-amber-500/10 text-amber-200";
  }

  return "border-border bg-surface text-text-secondary";
}

function projectSearchText(project: Project): string {
  return [
    project.title,
    project.summary,
    project.description,
    project.problem,
    project.solution,
    project.category,
    project.status,
    ...project.techStack,
    ...project.features,
    ...project.architecture
  ]
    .join(" ")
    .toLowerCase();
}

function buildMetrics(projects: Project[]): ProjectMetric[] {
  const uniqueTech = new Set(projects.flatMap((project) => project.techStack));
  const liveCount = projects.filter((project) => project.status === "live").length;
  const caseStudyCount = projects.filter((project) => project.hasCaseStudy).length;
  const featuredCount = projects.filter((project) => project.featured).length;

  return [
    {
      label: "Total Projects",
      value: String(projects.length),
      helper: "Real shipped and in-progress builds"
    },
    {
      label: "Live Projects",
      value: String(liveCount),
      helper: "Currently accessible deployments"
    },
    {
      label: "With Case Studies",
      value: String(caseStudyCount),
      helper: "Deep technical breakdown available"
    },
    {
      label: "Core Technologies",
      value: String(uniqueTech.size),
      helper: "Across frontend, backend, AI and workflows"
    },
    {
      label: "Featured Builds",
      value: String(featuredCount),
      helper: "Highest recruiter and client relevance"
    }
  ];
}

function SpotlightCard({ project }: { project: Project }) {
  return (
    <article className="group grid gap-5 rounded-3xl border border-border bg-surface-card p-4 sm:p-5 lg:grid-cols-[1.1fr_1fr]">
      <div className="relative min-h-[250px] overflow-hidden rounded-2xl border border-border bg-surface">
        <Image
          src={project.images[0]}
          alt={`${project.title} screenshot`}
          fill
          sizes="(max-width: 1024px) 100vw, 48vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-transparent" />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] uppercase tracking-[0.15em] text-accent">
            {getProjectCategoryLabel(project.category)}
          </span>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.15em]",
              getStatusBadgeClass(project.status)
            )}
          >
            {getProjectStatusLabel(project.status)}
          </span>
          {project.featured ? (
            <span className="rounded-full border border-accent/35 bg-accent-soft px-2.5 py-1 text-[11px] uppercase tracking-[0.15em] text-accent">
              Featured
            </span>
          ) : null}
        </div>

        <div>
          <h3 className="font-heading text-2xl leading-tight">
            <Link href={`/projects/${project.slug}`} className="transition hover:text-accent">
              {project.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{project.summary}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="text-xs uppercase tracking-[0.17em] text-accent">Problem</p>
            <p className="mt-1 text-sm text-text-secondary">{project.problem}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="text-xs uppercase tracking-[0.17em] text-accent">Solution</p>
            <p className="mt-1 text-sm text-text-secondary">{project.solution}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 6).map((tech) => (
            <span key={tech} className="rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center rounded-full border border-accent/35 bg-accent-soft px-4 py-2 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-surface"
          >
            Open Project
          </Link>
          {project.hasCaseStudy && project.links.caseStudy ? (
            <Link
              href={project.links.caseStudy}
              className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
            >
              Case Study
            </Link>
          ) : null}
          {project.links.live ? (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
            >
              Live Demo
            </a>
          ) : null}
          {project.links.github ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
            >
              GitHub
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function CompactCard({ project }: { project: Project }) {
  return (
    <article className="group rounded-2xl border border-border bg-surface-card p-4 transition hover:border-accent/35">
      <div className="relative h-44 overflow-hidden rounded-xl border border-border">
        <Image
          src={project.images[0]}
          alt={`${project.title} screenshot`}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] text-text-secondary">
            {getProjectCategoryLabel(project.category)}
          </span>
          <span className={cn("rounded-full border px-2 py-0.5 text-[11px]", getStatusBadgeClass(project.status))}>
            {getProjectStatusLabel(project.status)}
          </span>
        </div>

        <h3 className="mt-3 font-heading text-lg leading-tight">
          <Link href={`/projects/${project.slug}`} className="transition hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-text-secondary">{project.summary}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech} className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Project["category"]>("all");
  const [status, setStatus] = useState<"all" | Project["status"]>("all");
  const [sortKey, setSortKey] = useState<SortKey>("impact");
  const [hasCaseStudyOnly, setHasCaseStudyOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("spotlight");

  const categoryOptions = useMemo(
    () => ["all", ...Array.from(new Set(projects.map((project) => project.category))).sort()],
    [projects]
  );
  const metrics = useMemo(() => buildMetrics(projects), [projects]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const next = projects.filter((project) => {
      if (category !== "all" && project.category !== category) return false;
      if (status !== "all" && project.status !== status) return false;
      if (hasCaseStudyOnly && !project.hasCaseStudy) return false;
      if (featuredOnly && !project.featured) return false;

      if (!normalizedQuery) return true;
      return projectSearchText(project).includes(normalizedQuery);
    });

    const sorted = [...next];
    if (sortKey === "name-asc") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortKey === "name-desc") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortKey === "case-study-first") {
      sorted.sort((a, b) => {
        const caseStudyDelta = Number(b.hasCaseStudy) - Number(a.hasCaseStudy);
        if (caseStudyDelta !== 0) return caseStudyDelta;
        return compareProjectsByImpact(a, b);
      });
    } else {
      sorted.sort(compareProjectsByImpact);
    }

    return sorted;
  }, [category, featuredOnly, hasCaseStudyOnly, projects, query, sortKey, status]);

  const activeFiltersCount = Number(category !== "all") +
    Number(status !== "all") +
    Number(hasCaseStudyOnly) +
    Number(featuredOnly) +
    Number(Boolean(query.trim()));

  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
            Projects Explorer
          </p>
          <p className="text-xs text-text-secondary">
            {filtered.length} shown
            {activeFiltersCount > 0 ? ` • ${activeFiltersCount} active filter${activeFiltersCount > 1 ? "s" : ""}` : ""}
          </p>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
            <Search size={16} className="text-text-secondary" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, tech, feature, or architecture..."
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
              aria-label="Search projects"
            />
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
            <SlidersHorizontal size={15} className="text-text-secondary" />
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="w-full bg-transparent text-sm text-text-primary focus:outline-none"
              aria-label="Sort projects"
            >
              <option value="impact">Sort: Impact First</option>
              <option value="case-study-first">Sort: Case Study First</option>
              <option value="name-asc">Sort: Name A-Z</option>
              <option value="name-desc">Sort: Name Z-A</option>
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
              <List size={14} />
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
              <LayoutGrid size={14} />
              Grid
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {categoryOptions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item as "all" | Project["category"])}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition",
                category === item
                  ? "border-accent/40 bg-accent-soft text-accent"
                  : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
              )}
            >
              {item === "all" ? "All Categories" : getProjectCategoryLabel(item as Project["category"])}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(["all", "live", "in-progress", "archived"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStatus(option)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition",
                status === option
                  ? "border-accent/40 bg-accent-soft text-accent"
                  : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
              )}
            >
              {option === "all" ? "All Status" : getProjectStatusLabel(option)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setHasCaseStudyOnly((prev) => !prev)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition",
              hasCaseStudyOnly
                ? "border-accent/40 bg-accent-soft text-accent"
                : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
            )}
          >
            Case Studies Only
          </button>
          <button
            type="button"
            onClick={() => setFeaturedOnly((prev) => !prev)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition",
              featuredOnly
                ? "border-accent/40 bg-accent-soft text-accent"
                : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
            )}
          >
            Featured Only
          </button>

          {activeFiltersCount > 0 ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setStatus("all");
                setHasCaseStudyOnly(false);
                setFeaturedOnly(false);
                setSortKey("impact");
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
          <p className="font-heading text-xl">No projects matched this filter set.</p>
          <p className="mt-2 text-sm text-text-secondary">
            Try a different keyword or clear some filters.
          </p>
        </section>
      ) : viewMode === "spotlight" ? (
        <section className="space-y-5">
          {filtered.map((project) => (
            <SpotlightCard key={project.slug} project={project} />
          ))}
        </section>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <CompactCard key={project.slug} project={project} />
          ))}
        </section>
      )}
    </div>
  );
}
