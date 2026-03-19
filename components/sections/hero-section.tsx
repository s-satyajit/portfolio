import Image from "next/image";

import { ButtonLink } from "@/components/ui/button-link";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/data/profile";

export function HeroSection() {
  return (
    <section className="pb-16 pt-14 sm:pb-20 sm:pt-20">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <Reveal>
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-accent">
              {profile.heroLabel}
            </p>
            <h1 className="font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Building practical AI-powered products with full-stack depth.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
              Official portfolio of {profile.name}. Focused on intelligent systems, clean
              product interfaces, and production-minded engineering.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/projects">View Projects</ButtonLink>
              <ButtonLink href="/resume" variant="secondary">
                Resume
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Let&apos;s Talk
              </ButtonLink>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <Chip>M.E. in Artificial Intelligence</Chip>
              <Chip>{profile.availability.note}</Chip>
              <Chip>Based in Chandigarh, India</Chip>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative rounded-3xl border border-border bg-surface-card p-5 sm:p-6">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-elevated p-5">
              <div className="mb-4 flex items-center gap-4">
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

              <div className="space-y-3 text-sm">
                <div className="rounded-xl border border-border bg-surface px-3 py-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Currently Building
                  </p>
                  <p className="mt-1 text-text-secondary">
                    AI command panel grounded to portfolio data with recruiter-first summaries.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-surface px-3 py-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Current Focus
                  </p>
                  <p className="mt-1 text-text-secondary">
                    AI integration, API architecture, and high-trust product UX.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-surface px-3 py-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Open Roles
                  </p>
                  <p className="mt-1 text-text-secondary">
                    Internship, freelance, and full-time opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
