import { ButtonLink } from "@/components/ui/button-link";
import { Section } from "@/components/ui/section";

export function ContactCtaSection() {
  return (
    <Section
      id="contact-cta"
      eyebrow="Contact"
      title="Let’s build something useful"
      description="For hiring teams, client work, and serious collaborations. Reach out with context and goals, and I will respond with a clear next step."
      className="pb-24"
    >
      <div className="rounded-3xl border border-border bg-surface-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-2xl text-sm text-text-secondary">
            Open to internships, freelance projects, and full-time opportunities. Strong fit for
            AI-integrated product engineering and full-stack implementation.
          </p>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/contact">Start a Conversation</ButtonLink>
            <ButtonLink href="/resume" variant="secondary">
              View Resume
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
