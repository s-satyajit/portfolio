import Image from "next/image";
import { ArrowUpRight, CheckCircle2, CircleDot, GitBranch, Layers3 } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { featuredProjects, projects } from "@/data/projects";

function statusLabel(status: "live" | "in-progress" | "archived") {
  if (status === "live") return "Live";
  if (status === "in-progress") return "In Progress";
  return "Archived";
}

export function FeaturedProjectsSection() {
  const additional = projects.filter((project) => !project.featured).slice(0, 3);

  return (
    <Section
      id="featured-projects"
      eyebrow="Featured Projects"
      title="Product work with clear engineering decisions"
      description="Selected projects that best demonstrate delivery quality, system thinking, and practical product value."
      className="pt-14"
    >
      <div className="space-y-10">
        {featuredProjects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.04}>
            <article
              className={`group grid items-stretch gap-6 rounded-3xl border border-border bg-surface-card p-4 transition hover:border-accent/35 sm:p-6 lg:grid-cols-2 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-border bg-surface-elevated sm:min-h-[300px]">
                <Image
                  src={project.images[0]}
                  alt={`${project.title} visual`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full border border-border bg-surface-card/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-accent backdrop-blur">
                    {project.category}
                  </span>
                  <span className="rounded-full border border-border bg-surface-card/90 px-2.5 py-1 text-[11px] text-text-secondary backdrop-blur">
                    {statusLabel(project.status)}
                  </span>
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {additional.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.04}>
            <article className="group h-full rounded-2xl border border-border bg-surface-card p-5 transition hover:-translate-y-0.5 hover:border-accent/35">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                {project.category}
              </p>
              <p className="mt-2 font-heading text-lg">{project.title}</p>
              <p className="mt-2 text-sm text-text-secondary">{project.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span key={tech} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-text-secondary">
                    {tech}
                  </span>
                ))}
              </div>
              <ButtonLink href={`/projects/${project.slug}`} variant="ghost" className="mt-4 gap-1 px-0">
                Explore project
                <ArrowUpRight size={13} />
              </ButtonLink>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
