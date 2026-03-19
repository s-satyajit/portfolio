import { currentlyBuilding } from "@/data/currently-building";
import { experienceTimeline } from "@/data/experience";
import { formatDate } from "@/lib/utils";

import { Section } from "../ui/section";

export function ExperienceFocusSection() {
  return (
    <Section
      id="experience-focus"
      eyebrow="Experience + Current Focus"
      title="Active engineering, not passive portfolio content"
      description="A timeline of ongoing work, learning, and practical output."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {experienceTimeline.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-border bg-surface-card p-5"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-heading text-xl">{item.role}</h3>
                <span className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary">
                  {item.type}
                </span>
              </div>
              <p className="text-sm text-text-secondary">
                {item.company} • {item.location}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {formatDate(item.startDate)} -{" "}
                {item.endDate === "Present" ? "Present" : formatDate(item.endDate)}
              </p>
              <ul className="mt-3 space-y-1 text-sm text-text-secondary">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>• {highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface-card p-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
            Currently Building
          </p>
          <div className="mt-4 space-y-3">
            {currentlyBuilding.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-border bg-surface px-4 py-3"
              >
                <p className="font-heading text-base">{item.title}</p>
                <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-accent">
                  {item.stage}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
