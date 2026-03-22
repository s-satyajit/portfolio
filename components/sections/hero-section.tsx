import Image from "next/image";
import { ArrowRight, BriefcaseBusiness, Rocket, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/ui/reveal";
import { currentlyBuilding } from "@/data/currently-building";
import { profile } from "@/data/profile";
import { proofStats } from "@/data/proof-stats";

export function HeroSection() {
  const spotlightBuild = currentlyBuilding[0] ?? {
    title: "Applied AI product workflows",
    description: "Building and refining grounded AI features across portfolio projects."
  };
  const trustSignals = proofStats.slice(0, 2);

  return (
    <section className="pb-16 pt-12 sm:pb-20 sm:pt-16">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <Reveal>
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2.5">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
                {profile.heroLabel}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/35 bg-accent-soft px-2.5 py-1 text-[11px] text-accent">
                <Sparkles size={12} />
                Open to internship, freelance, and full-time roles
              </span>
            </div>

            <h1 className="font-heading text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Building AI-integrated products with full-stack clarity.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
              I am {profile.name}, an M.E. AI student and product-focused engineer. I build
              practical software that balances interface quality, backend reliability, and
              grounded AI behavior.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/projects" className="gap-1.5">
                View Projects
                <ArrowRight size={15} />
              </ButtonLink>
              <ButtonLink href="/resume" variant="secondary">
                Resume
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Contact
              </ButtonLink>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Chip>M.E. in Artificial Intelligence</Chip>
              <Chip>{profile.availability.note}</Chip>
              <Chip>Based in {profile.location}</Chip>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-surface-card p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                Recruiter Fast Path
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ButtonLink href="/recruiters" variant="secondary" className="px-4 py-2 text-xs">
                  Recruiter Brief
                </ButtonLink>
                <ButtonLink href="/case-studies" variant="secondary" className="px-4 py-2 text-xs">
                  Case Studies
                </ButtonLink>
                <ButtonLink href="/blog" variant="secondary" className="px-4 py-2 text-xs">
                  Technical Writing
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative rounded-3xl border border-border bg-surface-card p-5 shadow-[0_20px_60px_rgba(0,0,0,0.26)] sm:p-6">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(45,212,255,0.16),transparent_56%)]" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-elevated p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-border bg-surface">
                    <Image
                      src={profile.image}
                      alt={`${profile.name} profile`}
                      fill
                      sizes="56px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div>
                    <p className="font-heading text-lg">{profile.shortName}</p>
                    <p className="text-xs text-text-secondary">{profile.title}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-text-secondary">
                  <BriefcaseBusiness size={12} />
                  Open to work
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="rounded-xl border border-border bg-surface px-3 py-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Now Building
                  </p>
                  <p className="mt-1.5 text-text-primary">{spotlightBuild.title}</p>
                  <p className="mt-1 text-text-secondary">{spotlightBuild.description}</p>
                </div>

                <div className="rounded-xl border border-border bg-surface px-3 py-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Current Direction
                  </p>
                  <p className="mt-1 text-text-secondary">
                    AI integration, API architecture, and high-trust product UX.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {trustSignals.map((item) => (
                    <article key={item.label} className="rounded-xl border border-border bg-surface px-3 py-3">
                      <p className="font-heading text-base text-text-primary">{item.value}</p>
                      <p className="mt-1 text-xs text-text-secondary">{item.label}</p>
                    </article>
                  ))}
                </div>

                <div className="rounded-xl border border-border bg-surface px-3 py-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Role Fit
                  </p>
                  <p className="mt-1 text-text-secondary">
                    Frontend, full-stack, and applied AI product engineering roles.
                  </p>
                </div>

                <ButtonLink href="/about" variant="secondary" className="w-full gap-1.5">
                  <Rocket size={14} />
                  More About My Direction
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
