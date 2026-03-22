import { ArrowRight, Mail, UserRoundSearch } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Section } from "@/components/ui/section";

export function ContactCtaSection() {
  return (
    <Section
      id="contact-cta"
      eyebrow="Next Step"
      title="Start a serious conversation"
      description="If you are hiring, evaluating project fit, or planning a client build, I can share clear context and a practical execution approach."
      className="pb-24 pt-14"
    >
      <div className="rounded-3xl border border-border bg-surface-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="max-w-2xl space-y-3">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent-soft px-3 py-1 text-xs text-accent">
              <UserRoundSearch size={13} />
              Open to internship, freelance, and full-time opportunities
            </p>
            <p className="text-sm leading-relaxed text-text-secondary">
              Best fit for AI-integrated product engineering, full-stack implementation, dashboard workflows, and grounded assistant features.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/contact" className="gap-1.5">
              Start a Conversation
              <ArrowRight size={14} />
            </ButtonLink>
            <ButtonLink href="/resume" variant="secondary" className="gap-1.5">
              <Mail size={13} />
              View Resume
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
