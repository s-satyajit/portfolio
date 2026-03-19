import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { PageBackButton } from "@/components/layout/page-back-button";
import { ButtonLink } from "@/components/ui/button-link";
import { SchemaScript } from "@/components/ui/schema-script";
import { projects } from "@/data/projects";
import { buildPageMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return buildPageMetadata({
    title: `${project.title} - Project`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.images[0],
    type: "article"
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <>
      <SchemaScript
        schema={[
          articleSchema({
            path: `/projects/${project.slug}`,
            title: project.title,
            description: project.summary,
            publishedTime: "2026-01-01",
            image: project.images[0],
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
        <Container className="max-w-5xl">
          <div className="mb-3">
            <PageBackButton iconOnly />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Project</p>
          <h1 className="font-heading text-4xl sm:text-5xl">{project.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">{project.description}</p>

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

          <div className="mt-8 relative h-72 overflow-hidden rounded-2xl border border-border bg-surface-card sm:h-96">
            <Image
              src={project.images[0]}
              alt={`${project.title} screenshot`}
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
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

          <section className="mt-5 rounded-2xl border border-border bg-surface-card p-5">
            <h2 className="font-heading text-2xl">Key Features</h2>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {project.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </section>

          <section className="mt-5 rounded-2xl border border-border bg-surface-card p-5">
            <h2 className="font-heading text-2xl">Architecture Notes</h2>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {project.architecture.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>

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
          </div>
        </Container>
      </article>
    </>
  );
}
