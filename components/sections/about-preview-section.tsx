import { ButtonLink } from "@/components/ui/button-link";
import { Section } from "@/components/ui/section";
import { profile } from "@/data/profile";

export function AboutPreviewSection() {
  return (
    <Section
      id="about-preview"
      eyebrow="About"
      title="AI-focused engineer with full-stack foundations"
      description={profile.longBio}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-border bg-surface-card p-5">
          <p className="font-heading text-lg">Education</p>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            {profile.education.map((item) => (
              <li key={`${item.institution}-${item.degree}`}>
                • {item.degree} in {item.field}, {item.institution}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-border bg-surface-card p-5">
          <p className="font-heading text-lg">Current Direction</p>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            {profile.currentlyFocusing.map((focus) => (
              <li key={focus}>• {focus}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-6">
        <ButtonLink href="/about" variant="secondary">
          Read Full About
        </ButtonLink>
      </div>
    </Section>
  );
}
