import Link from "next/link";
import { notFound } from "next/navigation";

import { ContextualAIAssistant } from "@/components/ai/contextual-ai-assistant";
import { Container } from "@/components/layout/container";
import { PageBackButton } from "@/components/layout/page-back-button";
import { ProjectCoverMedia } from "@/components/projects/project-cover-media";
import { ButtonLink } from "@/components/ui/button-link";
import { SchemaScript } from "@/components/ui/schema-script";
import { getProjects } from "@/data/projects";
import { getProjectContentBySlug, renderMdx } from "@/lib/mdx";
import { compareProjectsByImpact, getProjectCategoryLabel, getProjectStatusLabel } from "@/lib/project-meta";
import { buildPageMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

function getStatusBadgeClass(status: Project["status"]): string {
  if (status === "live") return "border-emerald-400/35 bg-emerald-500/10 text-emerald-200";
  if (status === "in-progress") return "border-amber-400/35 bg-amber-500/10 text-amber-200";
  return "border-border bg-surface text-text-secondary";
}

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const projects = getProjects();
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  const coverImage = project.laptopImage || project.images[0];

  return buildPageMetadata({
    title: `${project.title} - Project`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: coverImage,
    type: "article"
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const projects = getProjects();
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const projectContent = await getProjectContentBySlug(project.slug);
  const content = projectContent ? await renderMdx(projectContent.content) : null;
  const coverImage = project.laptopImage || project.images[0];

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const previousProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug)
    .sort((a, b) => {
      const categoryDelta = Number(b.category === project.category) - Number(a.category === project.category);
      if (categoryDelta !== 0) return categoryDelta;
      return compareProjectsByImpact(a, b);
    })
    .slice(0, 3);

  return (
    <>
      <SchemaScript
        schema={[
          articleSchema({
            path: `/projects/${project.slug}`,
            title: project.title,
            description: project.summary,
            publishedTime: "2026-01-01",
            image: coverImage,
            type: "Article"
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.title, path: `/projects/${project.slug}` }
          ])
        ]}
      />

      <article className="py-14 sm:py-16">
        <Container className="max-w-6xl">
          <div className="mb-3">
            <PageBackButton iconOnly />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Project</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-surface-card px-2.5 py-1 text-xs text-text-secondary">
              {getProjectCategoryLabel(project.category)}
            </span>
            <span className={cn("rounded-full border px-2.5 py-1 text-xs", getStatusBadgeClass(project.status))}>
              {getProjectStatusLabel(project.status)}
            </span>
            {project.featured ? (
              <span className="rounded-full border border-accent/35 bg-accent-soft px-2.5 py-1 text-xs text-accent">
                Featured Build
              </span>
            ) : null}
            {project.hasCaseStudy ? (
              <span className="rounded-full border border-border bg-surface-card px-2.5 py-1 text-xs text-text-secondary">
                Case Study Available
              </span>
            ) : null}
          </div>

          <h1 className="mt-3 font-heading text-4xl sm:text-5xl">{project.title}</h1>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-text-secondary">{project.description}</p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <ProjectCoverMedia
              project={project}
              className="min-h-[320px] bg-surface-card sm:min-h-[420px]"
              sizes="(max-width: 1280px) 100vw, 900px"
              priority
            />

            <aside className="space-y-4 rounded-2xl border border-border bg-surface-card p-5">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Quick Context</p>
                <p className="mt-2 text-sm text-text-secondary">{project.summary}</p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-xs uppercase tracking-[0.17em] text-accent">Problem Lens</p>
                <p className="mt-1 text-sm text-text-secondary">{project.problem}</p>
              </div>

              {project.outcomes.length > 0 ? (
                <div className="grid gap-2">
                  {project.outcomes.map((outcome) => (
                    <div key={outcome.label} className="rounded-xl border border-border bg-surface p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">{outcome.label}</p>
                      <p className="mt-1 text-sm text-text-primary">{outcome.value}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2 pt-1">
                {project.links.live ? (
                  <ButtonLink href={project.links.live} variant="secondary" external>
                    Live Demo
                  </ButtonLink>
                ) : null}
                {project.links.github ? (
                  <ButtonLink href={project.links.github} variant="secondary" external>
                    GitHub
                  </ButtonLink>
                ) : null}
              </div>
            </aside>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-surface-card px-3 py-1 text-xs text-text-secondary"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <section className="rounded-2xl border border-border bg-surface-card p-5">
              <h2 className="font-heading text-2xl">Problem</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{project.problem}</p>
            </section>
            <section className="rounded-2xl border border-border bg-surface-card p-5">
              <h2 className="font-heading text-2xl">Solution</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{project.solution}</p>
            </section>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-border bg-surface-card p-5">
              <h2 className="font-heading text-2xl">Key Features</h2>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                {project.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-surface-card p-5">
              <h2 className="font-heading text-2xl">Architecture Notes</h2>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                {project.architecture.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </section>
          </div>

          {content ? (
            <section className="mt-5 rounded-2xl border border-border bg-surface-card p-6 sm:p-8">
              <div className="prose prose-invert max-w-none">{content}</div>
            </section>
          ) : null}

          {project.lessonsLearned.length > 0 ? (
            <section className="mt-5 rounded-2xl border border-border bg-surface-card p-5">
              <h2 className="font-heading text-2xl">Lessons Learned</h2>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                {project.lessonsLearned.map((lesson) => (
                  <li key={lesson}>- {lesson}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-5">
            <ContextualAIAssistant
              mode="project"
              projectSlug={project.slug}
              projectTitle={project.title}
              compact
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.github ? (
              <ButtonLink href={project.links.github} variant="secondary" external>
                GitHub
              </ButtonLink>
            ) : null}
            {project.links.live ? (
              <ButtonLink href={project.links.live} variant="secondary" external>
                Live Demo
              </ButtonLink>
            ) : null}
            {project.hasCaseStudy && project.links.caseStudy ? (
              <ButtonLink href={project.links.caseStudy} variant="secondary">
                Related Case Study
              </ButtonLink>
            ) : null}
            <ButtonLink href="/projects" variant="secondary">
              Back to Projects
            </ButtonLink>
          </div>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-heading text-2xl">Related Projects</h2>
              <Link href="/projects" className="text-sm text-accent hover:text-cyan-300">
                View all projects
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((item) => (
                <article key={item.slug} className="rounded-2xl border border-border bg-surface-card p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-accent">
                    {getProjectCategoryLabel(item.category)}
                  </p>
                  <h3 className="mt-2 font-heading text-lg leading-tight">
                    <Link href={`/projects/${item.slug}`} className="transition hover:text-accent">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">{item.summary}</p>
                </article>
              ))}
            </div>
          </section>

          {previousProject || nextProject ? (
            <nav className="mt-10 grid gap-3 sm:grid-cols-2">
              {previousProject ? (
                <Link
                  href={`/projects/${previousProject.slug}`}
                  className="rounded-2xl border border-border bg-surface-card p-4 transition hover:border-accent/35"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Previous Project</p>
                  <p className="mt-1 font-heading text-lg">{previousProject.title}</p>
                </Link>
              ) : (
                <div />
              )}

              {nextProject ? (
                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="rounded-2xl border border-border bg-surface-card p-4 text-left transition hover:border-accent/35"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Next Project</p>
                  <p className="mt-1 font-heading text-lg">{nextProject.title}</p>
                </Link>
              ) : null}
            </nav>
          ) : null}
        </Container>
      </article>
    </>
  );
}
