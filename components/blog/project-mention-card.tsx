import Link from "next/link";

import { projects } from "@/data/projects";

interface ProjectMentionCardProps {
  slugs: string[];
}

export function ProjectMentionCard({ slugs }: ProjectMentionCardProps) {
  const related = projects.filter((project) => slugs.includes(project.slug));
  if (related.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-surface-card p-5">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        Related Projects
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {related.map((project) => (
          <article key={project.slug} className="rounded-xl border border-border bg-surface p-4">
            <h3 className="font-heading text-lg">
              <Link href={`/projects/${project.slug}`} className="hover:text-accent">
                {project.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm text-text-secondary">{project.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
