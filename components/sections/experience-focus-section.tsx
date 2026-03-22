import { ArrowRight, BriefcaseBusiness, Compass, Workflow } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { currentlyBuilding } from "@/data/currently-building";
import { experienceTimeline } from "@/data/experience";
import { formatDate } from "@/lib/utils";

export function ExperienceFocusSection() {
  return (
    <Section
      id="experience-focus"
      eyebrow="Current Focus"
      title="Active execution across projects, AI workflows, and writing"
      description="What I am shipping now, where I am growing, and how that maps to real product contribution."
      className="pt-14"
    >
      <div className="grid gap-6 lg:grid-cols-[1.16fr_0.84fr]">
        <div className="space-y-4">
          {experienceTimeline.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.04}>
              <article className="rounded-2xl border border-border bg-surface-card p-5 transition hover:border-accent/30">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-heading text-xl">{item.role}</h3>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary">
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  {item.company} - {item.location}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  {formatDate(item.startDate)} -{" "}
                  {item.endDate === "Present" ? "Present" : formatDate(item.endDate)}
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.08}>
          <aside className="space-y-4 rounded-2xl border border-border bg-surface-card p-5">
            <div>
              <p className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.24em] text-accent">
                <Workflow size={13} />
                Currently Building
              </p>
              <div className="mt-4 space-y-3">
                {currentlyBuilding.map((item) => (
                  <article key={item.id} className="rounded-xl border border-border bg-surface px-4 py-3">
                    <p className="font-heading text-base">{item.title}</p>
                    <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.tech.slice(0, 3).map((tech) => (
                        <span key={tech} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-text-secondary">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                <Compass size={12} />
                What I Am Targeting
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Frontend/full-stack engineering roles and applied AI product tracks where fast execution and clear communication matter.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <ButtonLink href="/resume" variant="secondary" className="gap-1.5 px-4 py-2 text-xs">
                <BriefcaseBusiness size={13} />
                Resume
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" className="gap-1.5 px-4 py-2 text-xs">
                Talk About Roles
                <ArrowRight size={13} />
              </ButtonLink>
            </div>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}
