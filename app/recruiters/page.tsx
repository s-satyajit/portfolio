import Link from "next/link";

import { ContextualAIAssistant } from "@/components/ai/contextual-ai-assistant";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { profile } from "@/data/profile";
import { getProjects } from "@/data/projects";
import {
  recruiterActions,
  recruiterAiSuggestedPrompts,
  recruiterFaq,
  recruiterHero,
  recruiterLikelyContributions,
  recruiterProductExposure,
  recruiterProofItems,
  recruiterQuickFacts,
  recruiterRoleFit,
  recruiterStrongestAreas
} from "@/data/recruiter-brief";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Recruiter Brief",
  description:
    "Recruiter-first evaluation page for Satyajit Samal with role fit, strongest project proof, quick facts, and direct contact actions.",
  path: "/recruiters"
});

export default function RecruitersPage() {
  const projects = getProjects();

  return (
    <>
      <PageHeader
        eyebrow={recruiterHero.eyebrow}
        title={recruiterHero.title}
        description={recruiterHero.description}
        actions={
          <>
            <ButtonLink href="/resume">Open Resume</ButtonLink>
            <ButtonLink href={`mailto:${profile.email}`} variant="secondary" external>
              Email Me
            </ButtonLink>
          </>
        }
      />

      <Container className="pb-20">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">Quick summary</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-text-secondary">
                {recruiterHero.summaryLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-border bg-surface p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  Current Focus
                </p>
                <ul className="mt-2 space-y-2 text-sm text-text-secondary">
                  {profile.currentlyFocusing.map((focus) => (
                    <li key={focus}>- {focus}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">Role fit and why consider me</h2>

              <div className="mt-4 grid gap-3">
                {recruiterRoleFit.map((item) => (
                  <article key={item.role} className="rounded-xl border border-border bg-surface p-4">
                    <p className="font-heading text-lg">{item.role}</p>
                    <p className="mt-2 text-sm text-text-secondary">{item.reason}</p>
                  </article>
                ))}
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <article className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Strongest Areas
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-text-secondary">
                    {recruiterStrongestAreas.map((area) => (
                      <li key={area}>- {area}</li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Product Exposure
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-text-secondary">
                    {recruiterProductExposure.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </article>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">Strongest proof by use case</h2>
              <p className="mt-2 text-sm text-text-secondary">
                A quick map of which project to review first based on the skill area you want to
                evaluate.
              </p>

              <div className="mt-4 space-y-4">
                {recruiterProofItems.map((item) => {
                  const project = item.projectSlug
                    ? projects.find((projectItem) => projectItem.slug === item.projectSlug)
                    : null;
                  const ctaHref = item.ctaHref || (project ? `/projects/${project.slug}` : "/projects");

                  return (
                    <article key={item.id} className="rounded-xl border border-border bg-surface p-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                        {item.label}
                      </p>
                      <h3 className="mt-2 font-heading text-xl">{item.projectName}</h3>
                      <p className="mt-2 text-sm text-text-secondary">{item.summary}</p>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-border bg-surface-card p-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-accent">What I Built</p>
                          <p className="mt-1 text-sm text-text-secondary">{item.whatIBuilt}</p>
                        </div>
                        <div className="rounded-lg border border-border bg-surface-card p-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-accent">
                            Why Recruiters Care
                          </p>
                          <p className="mt-1 text-sm text-text-secondary">{item.whyItMatters}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <ButtonLink href={ctaHref} variant="secondary">
                          {item.ctaLabel}
                        </ButtonLink>
                        <Link
                          href="#recruiter-ai"
                          className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
                        >
                          Ask AI about this
                        </Link>
                      </div>
                      <p className="mt-2 text-xs text-text-secondary">Prompt: {item.aiPrompt}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">What I can likely contribute early</h2>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                {recruiterLikelyContributions.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">Recruiter FAQ</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Common screening questions answered directly.
              </p>

              <div className="mt-4 space-y-3">
                {recruiterFaq.map((item) => (
                  <details key={item.question} className="rounded-xl border border-border bg-surface p-4">
                    <summary className="cursor-pointer list-none font-medium text-text-primary">
                      {item.question}
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">Direct actions</h2>
              <p className="mt-2 text-sm text-text-secondary">
                If there is role alignment, these are the fastest next steps.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {recruiterActions.map((action) => (
                  <ButtonLink
                    key={action.label}
                    href={action.href}
                    variant={action.label === "Open Resume" ? "primary" : "secondary"}
                    external={action.external}
                  >
                    {action.label}
                  </ButtonLink>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-24 xl:h-fit">
            <section className="rounded-2xl border border-border bg-surface-card p-5">
              <h2 className="font-heading text-2xl">Quick facts</h2>
              <p className="mt-2 text-sm text-text-secondary">Built for 10-second scanning.</p>

              <dl className="mt-4 grid gap-3">
                {recruiterQuickFacts.map((fact) => (
                  <div key={fact.label} className="rounded-xl border border-border bg-surface p-3">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-sm text-text-secondary">
                      {fact.href ? (
                        <a
                          href={fact.href}
                          className="text-accent hover:text-cyan-300"
                          target={fact.href.startsWith("http") ? "_blank" : undefined}
                          rel={fact.href.startsWith("http") ? "noreferrer" : undefined}
                        >
                          {fact.value}
                        </a>
                      ) : (
                        fact.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <div id="recruiter-ai">
              <ContextualAIAssistant mode="recruiter" suggestedPrompts={recruiterAiSuggestedPrompts} />
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
