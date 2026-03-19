import { Section } from "@/components/ui/section";

const capabilities = [
  {
    title: "AI-Powered Applications",
    description:
      "Designing practical AI workflows, grounded assistant layers, and model-powered features."
  },
  {
    title: "Full-Stack Web Products",
    description:
      "Building end-to-end products with clear frontend UX and maintainable backend interfaces."
  },
  {
    title: "Frontend Engineering",
    description:
      "High-trust interfaces with strong information hierarchy, responsiveness, and usability."
  },
  {
    title: "Backend APIs and Workflows",
    description: "Secure route design, validation, authentication patterns, and deployment-minded logic."
  },
  {
    title: "Dashboards and Operations Surfaces",
    description: "Data-heavy product interfaces built for clarity, actionability, and real-world usage."
  },
  {
    title: "Research and Technical Writing",
    description:
      "Structured analytical writing, implementation notes, and publication-oriented thinking."
  }
];

export function CapabilitiesSection() {
  return (
    <Section
      id="capabilities"
      eyebrow="What I Build"
      title="AI + full-stack capabilities with product discipline"
      description="Clear capability coverage for both hiring teams and client engagements."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {capabilities.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-border bg-surface-card p-5 transition hover:border-accent/30"
          >
            <h3 className="font-heading text-xl">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
