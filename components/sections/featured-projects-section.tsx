import Image from "next/image";

import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { featuredProjects, projects } from "@/data/projects";

export function FeaturedProjectsSection() {
  const additional = projects.filter((project) => !project.featured).slice(0, 3);

  return (
    <Section
      id="featured-projects"
      eyebrow="Featured Work"
      title="Case-study style project breakdowns"
      description="Projects selected for product impact, engineering depth, and recruiter/client relevance."
    >
      <div className="space-y-10">
        {featuredProjects.map((project, index) => (
          <Reveal key={project.slug}>
            <article
              className={`grid items-stretch gap-6 rounded-3xl border border-border bg-surface-card p-4 sm:p-6 lg:grid-cols-2 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-border bg-surface-elevated">
                <Image
                  src={project.images[0]}
                  alt={`${project.title} visual`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
                  {project.category}
                </p>
                <h3 className="font-heading text-2xl">{project.title}</h3>
                <p className="text-sm text-text-secondary">{project.summary}</p>
                <p className="text-sm text-text-secondary">
                  <span className="text-text-primary">Problem: </span>
                  {project.problem}
                </p>
                <p className="text-sm text-text-secondary">
                  <span className="text-text-primary">Architecture: </span>
                  {project.architecture[0]}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.hasCaseStudy && project.links.caseStudy ? (
                    <ButtonLink href={project.links.caseStudy} variant="secondary">
                      View Case Study
                    </ButtonLink>
                  ) : (
                    <ButtonLink href={`/projects/${project.slug}`} variant="secondary">
                      View Project
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
        {additional.map((project) => (
          <article
            key={project.slug}
            className="rounded-2xl border border-border bg-surface-card p-5 transition hover:border-accent/30"
          >
            <p className="font-heading text-lg">{project.title}</p>
            <p className="mt-2 text-sm text-text-secondary">{project.summary}</p>
            <ButtonLink href={`/projects/${project.slug}`} variant="ghost" className="mt-4 px-0">
              Explore →
            </ButtonLink>
          </article>
        ))}
      </div>
    </Section>
  );
}
