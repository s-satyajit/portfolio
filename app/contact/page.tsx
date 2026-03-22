import Link from "next/link";

import { ContextualAIAssistant } from "@/components/ai/contextual-ai-assistant";
import { ScrollSyncedSidebar } from "@/components/about/scroll-synced-sidebar";
import { ContactSidePanel } from "@/components/contact/contact-side-panel";
import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { SchemaScript } from "@/components/ui/schema-script";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { socialLinks } from "@/data/social-links";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbSchema, profilePageSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact Satyajit Samal for full-time roles, internship opportunities, freelance projects, and product-focused AI + full-stack collaboration.",
  path: "/contact"
});

const contactTracks = [
  {
    title: "Hiring teams",
    description:
      "Best for full-time or internship evaluation. Share role scope, ownership, and interview timeline.",
    ctaLabel: "Open Recruiter Brief",
    ctaHref: "/recruiters",
    bullets: ["Role expectations", "Team context", "Interview process and timeline"]
  },
  {
    title: "Freelance and client work",
    description:
      "Best for scoped product builds, dashboards, and AI-enabled feature implementation with clear outcomes.",
    ctaLabel: "View Services",
    ctaHref: "/services",
    bullets: ["Project objective", "Current stack and constraints", "Timeline and budget context"]
  },
  {
    title: "Technical collaboration",
    description:
      "Best for architecture discussions, research-aligned implementation, and product engineering collaboration.",
    ctaLabel: "Explore Insights",
    ctaHref: "/insights",
    bullets: ["Problem statement", "Technical depth required", "Expected collaboration format"]
  }
];

const intakeChecklist = [
  "What you need built or discussed.",
  "Why this matters now and desired timeline.",
  "Any existing stack, repo, or product constraints.",
  "What outcome would make this engagement successful."
];

const trustedSignals = [
  { label: "Primary response window", value: "24-48 hours" },
  { label: "Preferred first contact", value: "Async context via this form" },
  { label: "Timezone", value: "IST (UTC +5:30)" },
  { label: "Focus", value: "AI-integrated full-stack product delivery" }
];

export default function ContactPage() {
  const linkedIn = socialLinks.find((item) => item.label === "LinkedIn")?.href;
  const featuredProjects = projects.filter((item) => item.featured).slice(0, 2);
  const highlightedServices = services.slice(0, 3);

  return (
    <>
      <SchemaScript
        schema={[
          profilePageSchema(
            "/contact",
            "Contact Satyajit Samal",
            "Professional contact page for hiring, freelance, and collaboration opportunities."
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" }
          ])
        ]}
      />

      <PageHeader
        eyebrow="Contact"
        title="Start a focused conversation"
        description="For hiring teams, freelance projects, and technical collaboration. Share context clearly and I will reply with practical next steps."
        actions={
          <>
            <ButtonLink href="/resume">Open Resume</ButtonLink>
            <ButtonLink href={`mailto:${profile.email}`} variant="secondary" external>
              Direct Email
            </ButtonLink>
          </>
        }
      />

      <Container className="space-y-8 pb-20">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {trustedSignals.map((item) => (
            <article key={item.label} className="rounded-2xl border border-border bg-surface-card p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                {item.label}
              </p>
              <p className="mt-2 text-sm text-text-secondary">{item.value}</p>
            </article>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <ScrollSyncedSidebar className="scrollbar-hide relative space-y-6 xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:overscroll-contain">
            <ContactSidePanel />
          </ScrollSyncedSidebar>

          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">Choose the right contact track</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Pick the path that fits your intent, then submit your brief through the form below.
              </p>

              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {contactTracks.map((track) => (
                  <article key={track.title} className="rounded-xl border border-border bg-surface p-4">
                    <h3 className="font-heading text-lg">{track.title}</h3>
                    <p className="mt-2 text-sm text-text-secondary">{track.description}</p>
                    <ul className="mt-3 space-y-1 text-sm text-text-secondary">
                      {track.bullets.map((point) => (
                        <li key={point}>- {point}</li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <ButtonLink href={track.ctaHref} variant="secondary">
                        {track.ctaLabel}
                      </ButtonLink>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">What to include for a faster reply</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <article className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Brief Checklist
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                    {intakeChecklist.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Best Work To Review
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-text-secondary">
                    {featuredProjects.map((project) => (
                      <p key={project.slug}>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="text-accent transition hover:text-cyan-300"
                        >
                          {project.title}
                        </Link>{" "}
                        - {project.summary}
                      </p>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <ButtonLink href="/projects" variant="secondary">
                      View All Projects
                    </ButtonLink>
                  </div>
                </article>
              </div>
            </section>

            <section>
              <ContactForm />
            </section>

            <ContextualAIAssistant
              mode="contact"
              heading="Need help framing your message?"
              helperText="Use AI to draft better context before submitting. Answers stay grounded to portfolio, services, and current focus."
              suggestedPrompts={[
                "What details should I include for a freelance request?",
                "Which projects should recruiters review first?",
                "What services are the best fit for dashboard development?",
                "How quickly can he respond to collaboration messages?",
                "What is his strongest stack for product builds?"
              ]}
            />

            <section className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">Continue evaluation before reaching out</h2>
              <p className="mt-2 text-sm text-text-secondary">
                If you need more proof first, these pages provide a faster signal on fit and depth.
              </p>

              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {highlightedServices.map((service) => (
                  <article key={service.slug} className="rounded-xl border border-border bg-surface p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                      Service
                    </p>
                    <h3 className="mt-2 font-heading text-lg">{service.title}</h3>
                    <p className="mt-2 text-sm text-text-secondary">{service.summary}</p>
                  </article>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <ButtonLink href="/services" variant="secondary">
                  Services
                </ButtonLink>
                <ButtonLink href="/blog" variant="secondary">
                  Blog
                </ButtonLink>
                <ButtonLink href="/insights" variant="secondary">
                  Research + Case Studies
                </ButtonLink>
                {linkedIn ? (
                  <ButtonLink href={linkedIn} variant="secondary" external>
                    LinkedIn
                  </ButtonLink>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </Container>
    </>
  );
}
