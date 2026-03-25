import { ArrowRight, BriefcaseBusiness, Cpu, FlaskConical, Rocket } from "lucide-react";

import { GithubHeatmap } from "@/components/sections/github-heatmap";
import { ButtonLink } from "@/components/ui/button-link";
import { Section } from "@/components/ui/section";
import { currentlyBuilding } from "@/data/currently-building";
import { getProjects } from "@/data/projects";
import { proofStats } from "@/data/proof-stats";
import { Reveal } from "@/components/ui/reveal";

const proofIcons = [Rocket, Cpu, FlaskConical, BriefcaseBusiness] as const;

export function ProofStripSection() {
  const projectCount = getProjects().length;
  const resolvedProofStats = proofStats.map((item) =>
    item.label === "Shipped Projects" ? { ...item, value: String(projectCount) } : item
  );

  return (
    <Section
      id="proof"
      eyebrow="Proof"
      title="Fast signals that establish trust"
      description="A quick recruiter/client view of shipped work, technical direction, and consistency."
      className="pt-4"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resolvedProofStats.map((item, index) => {
          const Icon = proofIcons[index % proofIcons.length];
          return (
            <Reveal key={item.label} delay={index * 0.04}>
              <article className="group h-full rounded-2xl border border-border bg-surface-card p-5 transition hover:-translate-y-0.5 hover:border-accent/40">
                <span className="inline-flex rounded-full border border-accent/35 bg-accent-soft p-2 text-accent">
                  <Icon size={15} />
                </span>
                <p className="mt-4 font-heading text-2xl">{item.value}</p>
                <p className="mt-2 text-sm font-medium">{item.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">{item.note}</p>
              </article>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.6fr)] lg:items-stretch lg:[&>*]:h-full">
        <Reveal className="flex h-full flex-col">
          <GithubHeatmap username="s-satyajit" compact className="h-full" />
        </Reveal>

        <Reveal delay={0.08} className="flex h-full flex-col">
          <aside className="flex h-full min-h-full flex-col rounded-2xl border border-border bg-surface-card p-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
              Momentum
            </p>
            <h3 className="mt-3 font-heading text-xl">Current work in motion</h3>
            <div className="mt-4 space-y-3">
              {currentlyBuilding.slice(0, 3).map((item) => (
                <article key={item.id} className="rounded-xl border border-border bg-surface px-3 py-3">
                  <p className="text-sm text-text-primary">{item.title}</p>
                  <p className="mt-1 text-xs text-text-secondary">{item.stage}</p>
                </article>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              <ButtonLink href="/projects" variant="secondary" className="gap-1.5 px-4 py-2 text-xs">
                Explore Work
                <ArrowRight size={13} />
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" className="px-4 py-2 text-xs">
                Contact
              </ButtonLink>
            </div>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}
