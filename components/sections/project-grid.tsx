import Image from "next/image";
import Link from "next/link";

import { Project } from "@/types/project";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <article
          key={project.slug}
          className="group rounded-2xl border border-border bg-surface-card p-4 transition hover:border-accent/35"
        >
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
            <h3 className="font-heading text-lg">
              <Link href={`/projects/${project.slug}`} className="hover:text-accent">
                {project.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm text-text-secondary">{project.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
