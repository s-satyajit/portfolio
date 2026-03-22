import { ArrowRight, BriefcaseBusiness, GraduationCap, Waypoints } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { profile } from "@/data/profile";

export function AboutPreviewSection() {
  return (
    <Section
      id="about-preview"
      eyebrow="About"
      title="Background, experience, and engineering direction"
      description={profile.longBio}
      className="pt-14"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Reveal>
          <article className="rounded-2xl border border-border bg-surface-card p-5">
            <p className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              <GraduationCap size={13} />
              Education
            </p>
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              {profile.education.map((item) => (
                <li key={`${item.institution}-${item.degree}`} className="rounded-xl border border-border bg-surface p-3">
                  <p className="text-text-primary">{item.degree} in {item.field}</p>
                  <p className="mt-1 text-xs text-text-secondary">{item.institution}</p>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>

        <Reveal delay={0.06}>
          <article className="rounded-2xl border border-border bg-surface-card p-5">
            <p className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              <BriefcaseBusiness size={13} />
              Professional Experience
            </p>
            <div className="mt-4 rounded-xl border border-accent/35 bg-accent-soft p-3">
              <p className="font-heading text-base text-text-primary">
                1 year in software development
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                EduSkills Foundation
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-surface p-3">
              <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                <Waypoints size={12} />
                Current Direction
              </p>
              <ul className="mt-2 space-y-2 text-sm text-text-secondary">
                {profile.currentlyFocusing.slice(0, 2).map((focus) => (
                  <li key={focus}>- {focus}</li>
                ))}
              </ul>
            </div>
          </article>
        </Reveal>
      </div>

      <div className="mt-6">
        <ButtonLink href="/about" variant="secondary" className="gap-1.5">
          Read Full About
          <ArrowRight size={14} />
        </ButtonLink>
      </div>
    </Section>
  );
}
