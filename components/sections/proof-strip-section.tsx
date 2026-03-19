import { GithubHeatmap } from "@/components/sections/github-heatmap";
import { Section } from "@/components/ui/section";
import { proofStats } from "@/data/proof-stats";

export function ProofStripSection() {
  return (
    <Section
      id="proof"
      eyebrow="Trust Signals"
      title="Built for recruiters and clients to verify quickly"
      description="A concise snapshot of shipped work, technical focus, and active engineering consistency."
      className="pt-4"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {proofStats.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-border bg-surface-card p-5 transition hover:border-accent/30"
          >
            <p className="font-heading text-2xl">{item.value}</p>
            <p className="mt-2 text-sm font-medium">{item.label}</p>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">{item.note}</p>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <GithubHeatmap username="s-satyajit" compact />
      </div>
    </Section>
  );
}
