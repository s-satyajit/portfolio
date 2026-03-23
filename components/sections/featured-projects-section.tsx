import { ArrowUpRight, CheckCircle2, CircleDot, GitBranch, Layers3 } from "lucide-react";

import { ProjectCoverMedia } from "@/components/projects/project-cover-media";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { getHomepageProjects } from "@/data/projects";

export function FeaturedProjectsSection() {
  const homepageProjects = getHomepageProjects();

  return (
    <Section
      id="featured-projects"
      eyebrow="Homepage Project Spotlight"
      title="Selected project highlights"
      description="A focused set of builds that best represent my product thinking, engineering depth, and real-world execution."
      className="pt-14"
    >
      {homepageProjects.length > 0 ? (
        <div className="space-y-10">
          {homepageProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.04}>
              <article
                className={`group grid items-stretch gap-6 rounded-3xl border border-border bg-surface-card p-4 transition hover:border-accent/35 sm:p-6 lg:grid-cols-2 ${
                  index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative min-h-[260px] sm:min-h-[300px]">
                  <ProjectCoverMedia
                    project={project}
                    className="h-full min-h-[260px] bg-surface-elevated sm:min-h-[300px]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    imageClassName="transition duration-500 group-hover:scale-[1.03]"
                    mockupImageFit="contain"
                  />
                  <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
                  {project.featured ? (
                    <span className="absolute right-3 top-3 z-[8] rounded-full border border-accent/35 bg-accent-soft px-2.5 py-1 text-[11px] text-accent backdrop-blur">
                      Featured
                    </span>
                  ) : null}
                  <div className="absolute bottom-3 left-3 right-3 z-[8] flex items-end justify-between gap-2">
                    <span className="rounded-full border border-border bg-surface-card/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-accent backdrop-blur">
                      {project.category}
                    </span>
                    {project.status === "live" ? (
                      <span className="relative z-[9] rounded-full border border-emerald-400/35 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200 backdrop-blur">
                        Live
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-heading text-2xl sm:text-[1.7rem]">{project.title}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary">{project.summary}</p>

                  <div className="rounded-xl border border-border bg-surface p-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                      Problem
                    </p>
                    <p className="mt-1.5 text-sm text-text-secondary">{project.problem}</p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface p-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                      Why It Matters
                    </p>
                    <p className="mt-1.5 text-sm text-text-secondary">{project.solution}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-surface p-3">
                      <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                        <Layers3 size={12} />
                        Highlights
                      </p>
                      <ul className="mt-2 space-y-1.5 text-xs text-text-secondary">
                        {project.features.slice(0, 2).map((feature) => (
                          <li key={feature} className="flex items-start gap-1.5">
                            <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-accent" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border bg-surface p-3">
                      <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                        <GitBranch size={12} />
                        Architecture
                      </p>
                      <ul className="mt-2 space-y-1.5 text-xs text-text-secondary">
                        {project.architecture.slice(0, 2).map((item) => (
                          <li key={item} className="flex items-start gap-1.5">
                            <CircleDot size={12} className="mt-0.5 shrink-0 text-accent" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.outcomes.map((outcome) => (
                      <span
                        key={outcome.label}
                        className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-xs text-accent"
                      >
                        {outcome.label}: {outcome.value}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.hasCaseStudy && project.links.caseStudy ? (
                      <ButtonLink href={project.links.caseStudy} variant="secondary" className="gap-1.5">
                        View Case Study
                        <ArrowUpRight size={14} />
                      </ButtonLink>
                    ) : (
                      <ButtonLink href={`/projects/${project.slug}`} variant="secondary" className="gap-1.5">
                        View Project
                        <ArrowUpRight size={14} />
                      </ButtonLink>
                    )}
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
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface-card p-6">
          <p className="text-sm text-text-secondary">
            No projects are currently marked for homepage spotlight.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/projects" variant="secondary" className="gap-1.5">
          Explore More Projects
          <ArrowUpRight size={14} />
        </ButtonLink>
      </div>
    </Section>
  );
}
