import Image from "next/image";
import Link from "next/link";

import { ScrollSyncedSidebar } from "@/components/about/scroll-synced-sidebar";
import { ContextualAIAssistant } from "@/components/ai/contextual-ai-assistant";
import { Container } from "@/components/layout/container";
import { GithubHeatmap } from "@/components/sections/github-heatmap";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { SchemaScript } from "@/components/ui/schema-script";
import { currentlyBuilding } from "@/data/currently-building";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { socialLinks } from "@/data/social-links";
import { buildPageMetadata } from "@/lib/seo";
import { profilePageSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "About",
  description:
    "Learn who Satyajit Samal is, what he is building now, why he is moving toward applied AI, and how he approaches product-focused engineering.",
  path: "/about"
});

const navSections = [
  { id: "about-intro", label: "Introduction" },
  { id: "focus-now", label: "Focus now" },
  { id: "journey", label: "Journey" },
  { id: "mindset", label: "How I build" },
  { id: "build-categories", label: "What I build" },
  { id: "current-stack", label: "Current stack" },
  { id: "currently-building", label: "Currently building" },
  { id: "principles", label: "Work principles" },
  { id: "ask-about-me", label: "Ask about me" },
  { id: "next-step", label: "Next steps" }
];

const stageLabel: Record<(typeof currentlyBuilding)[number]["stage"], string> = {
  building: "Building",
  researching: "Researching",
  shipping: "Shipping"
};

export default function AboutPage() {
  const ongoingProgram = profile.education.find((item) => item.status === "ongoing");
  const previousProgram = profile.education.find((item) => item.status === "completed");
  const currentProgramLabel = ongoingProgram
    ? `${ongoingProgram.degree} in ${ongoingProgram.field}, ${ongoingProgram.institution}`
    : "M.E. in Artificial Intelligence";
  const foundationLabel = previousProgram
    ? `${previousProgram.degree} in ${previousProgram.field}`
    : "B.Tech in Computer Science and Engineering";
  const experienceLabel = "1 year software development experience at EduSkills Foundation";

  const githubLink =
    socialLinks.find((item) => item.label === "GitHub")?.href || "https://github.com/s-satyajit";
  const linkedInLink =
    socialLinks.find((item) => item.label === "LinkedIn")?.href ||
    "https://www.linkedin.com/in/satyajitsamal/";

  const highlightedProjects = projects.filter((item) => item.featured).slice(0, 3);

  return (
    <>
      <SchemaScript
        schema={profilePageSchema(
          "/about",
          "About Satyajit Samal",
          "Background, education, and engineering direction."
        )}
      />

      <PageHeader
        eyebrow="About"
        title="About Satyajit Samal"
        description={profile.aboutIntro.intro}
        actions={
          <>
            <ButtonLink href="/resume">View Resume</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Contact Me
            </ButtonLink>
          </>
        }
      />

      <Container className="overflow-x-hidden pb-20 sm:overflow-x-visible">
        <section className="relative z-30 rounded-2xl border border-border bg-surface-card p-3 backdrop-blur sm:sticky sm:top-16 sm:-mx-4 sm:rounded-none sm:border-x-0 sm:border-y sm:bg-surface/95 sm:px-4 sm:py-3 xl:hidden">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">On This Page</p>
          <nav className="mt-2 flex flex-wrap gap-2 sm:flex-nowrap sm:overflow-x-auto sm:pb-1">
            {navSections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="whitespace-nowrap rounded-full border border-border bg-surface-card px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </section>

        <div className="min-w-0 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <ScrollSyncedSidebar className="scrollbar-hide relative hidden space-y-6 xl:sticky xl:top-24 xl:block xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:overscroll-contain">
            <section className="rounded-2xl border border-border bg-surface-card p-4 sm:p-5">
              <div className="flex items-center gap-4 sm:block">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border sm:mx-auto sm:h-36 sm:w-36">
                  <Image
                    src={profile.image}
                    alt={`${profile.name} portrait`}
                    fill
                    sizes="(max-width: 640px) 80px, 144px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 sm:mt-4">
                  <p className="truncate text-left font-heading text-xl sm:text-center">{profile.name}</p>
                  <p className="mt-1 text-left text-sm text-text-secondary sm:text-center">
                    {profile.title}
                  </p>
                  <p className="mt-2 text-left text-sm text-text-secondary sm:text-center">
                    {profile.location}
                  </p>
                </div>
              </div>

              <p className="mt-3 rounded-xl border border-border bg-surface p-3 text-sm text-text-secondary sm:mt-4">
                {profile.availability.note}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:justify-center">
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
                >
                  GitHub
                </a>
                <a
                  href={linkedInLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
                >
                  LinkedIn
                </a>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface-card p-4 sm:p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                Snapshot
              </p>
              <dl className="mt-3 grid gap-2 sm:gap-3">
                <div className="rounded-xl border border-border bg-surface p-3">
                  <dt className="text-xs uppercase tracking-[0.16em] text-text-secondary">Current</dt>
                  <dd className="ml-0 mt-1 break-words text-sm text-text-primary sm:break-normal">{currentProgramLabel}</dd>
                </div>
                <div className="rounded-xl border border-border bg-surface p-3">
                  <dt className="text-xs uppercase tracking-[0.16em] text-text-secondary">Foundation</dt>
                  <dd className="ml-0 mt-1 break-words text-sm text-text-primary sm:break-normal">{foundationLabel}</dd>
                </div>
                <div className="rounded-xl border border-border bg-surface p-3">
                  <dt className="text-xs uppercase tracking-[0.16em] text-text-secondary">Experience</dt>
                  <dd className="ml-0 mt-1 break-words text-sm text-text-primary sm:break-normal">{experienceLabel}</dd>
                </div>
                <div className="rounded-xl border border-border bg-surface p-3">
                  <dt className="text-xs uppercase tracking-[0.16em] text-text-secondary">Direction</dt>
                  <dd className="ml-0 mt-1 text-sm text-text-primary">
                    Applied AI + full-stack product systems
                  </dd>
                </div>
              </dl>
            </section>

            <section className="hidden rounded-2xl border border-border bg-surface-card p-5 xl:block">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                On This Page
              </p>
              <nav className="mt-3 space-y-2">
                {navSections.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block rounded-lg border border-transparent px-2 py-1.5 text-sm text-text-secondary transition hover:border-border hover:bg-surface hover:text-text-primary"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </section>
          </ScrollSyncedSidebar>

          <div className="min-w-0 space-y-6">
            <section className="rounded-2xl border border-border bg-surface-card p-4 sm:p-5 xl:hidden">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border">
                  <Image
                    src={profile.image}
                    alt={`${profile.name} portrait`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-heading text-xl">{profile.name}</p>
                  <p className="mt-1 text-sm text-text-secondary">{profile.title}</p>
                  <p className="mt-1 text-sm text-text-secondary">{profile.location}</p>
                </div>
              </div>

              <div className="mt-3 grid gap-2">
                <article className="rounded-xl border border-border bg-surface p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Current</p>
                  <p className="mt-1 break-words text-sm text-text-primary sm:break-normal">{currentProgramLabel}</p>
                </article>
                <article className="rounded-xl border border-border bg-surface p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Foundation</p>
                  <p className="mt-1 break-words text-sm text-text-primary sm:break-normal">{foundationLabel}</p>
                </article>
                <article className="rounded-xl border border-border bg-surface p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Experience</p>
                  <p className="mt-1 break-words text-sm text-text-primary sm:break-normal">{experienceLabel}</p>
                </article>
                <article className="rounded-xl border border-border bg-surface p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">Direction</p>
                  <p className="mt-1 text-sm text-text-primary">
                    Applied AI + full-stack product systems
                  </p>
                </article>
              </div>

              <p className="mt-3 rounded-xl border border-border bg-surface p-3 text-sm text-text-secondary">
                {profile.availability.note}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
                >
                  GitHub
                </a>
                <a
                  href={linkedInLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
                >
                  LinkedIn
                </a>
              </div>
            </section>

            <Reveal>
              <section id="about-intro" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Intro</p>
                <h2 className="mt-3 font-heading text-2xl sm:text-3xl">
                  Building practical systems with a clear move toward AI
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{profile.longBio}</p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {profile.aboutIntro.direction}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {profile.aboutIntro.longTerm}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.03}>
              <section id="focus-now" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
                <h2 className="font-heading text-2xl">What I am focused on now</h2>
                <p className="mt-2 text-sm text-text-secondary">
                  This is where most of my energy is currently going.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {profile.focusNow.map((item) => (
                    <article key={item.title} className="rounded-xl border border-border bg-surface p-4">
                      <p className="font-heading text-lg">{item.title}</p>
                      <p className="mt-2 text-sm text-text-secondary">{item.detail}</p>
                      {item.nextStep ? (
                        <p className="mt-3 text-xs text-accent">Next: {item.nextStep}</p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.05}>
              <section id="journey" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
                <h2 className="font-heading text-2xl">My journey so far</h2>
                <p className="mt-2 text-sm text-text-secondary">
                  A concise timeline of where I started, what changed, and where I am headed.
                </p>

                <div className="mt-5 border-l border-border pl-4 sm:pl-5">
                  <div className="space-y-4">
                    {profile.journey.map((item) => (
                      <article
                        key={item.id}
                        className="relative rounded-xl border border-border bg-surface p-4 before:hidden sm:before:absolute sm:before:-left-[1.15rem] sm:before:top-6 sm:before:h-2.5 sm:before:w-2.5 sm:before:rounded-full sm:before:border sm:before:border-accent/50 sm:before:bg-accent"
                      >
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                          {item.period}
                        </p>
                        <h3 className="mt-2 font-heading text-lg">{item.title}</h3>
                        <p className="mt-2 text-sm text-text-secondary">{item.description}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.08}>
              <section id="mindset" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
                <h2 className="font-heading text-2xl">How I think about building</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {profile.buildingMindset.map((item) => (
                    <article key={item} className="rounded-xl border border-border bg-surface p-4">
                      <p className="text-sm leading-relaxed text-text-secondary">{item}</p>
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.1}>
              <section id="build-categories" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
                <h2 className="font-heading text-2xl">What I build</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {profile.buildCategories.map((item) => (
                    <article key={item.title} className="rounded-xl border border-border bg-surface p-4">
                      <h3 className="font-heading text-lg">{item.title}</h3>
                      <p className="mt-2 text-sm text-text-secondary">{item.summary}</p>
                      {item.examples?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.examples.map((example) => (
                            <span
                              key={example}
                              className="rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.12}>
              <section id="current-stack" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
                <h2 className="font-heading text-2xl">Current stack</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {profile.stackByCategory.map((group) => (
                    <article key={group.title} className="rounded-xl border border-border bg-surface p-4">
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                        {group.title}
                      </p>
                      <p className="mt-2 text-sm text-text-secondary">{group.items.join(" | ")}</p>
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.14}>
              <section id="currently-building" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
                <h2 className="font-heading text-2xl">Currently building</h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Active work and experiments I am pushing forward right now.
                </p>
                <div className="mt-4 grid gap-3">
                  {currentlyBuilding.map((item) => (
                    <article key={item.id} className="rounded-xl border border-border bg-surface p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-heading text-lg">{item.title}</h3>
                        <span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-xs text-accent">
                          {stageLabel[item.stage]}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-text-secondary">{item.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.tech.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.16}>
              <section className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
                <h2 className="font-heading text-2xl">Projects that reflect this direction</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {highlightedProjects.map((project) => (
                    <article key={project.slug} className="rounded-xl border border-border bg-surface p-4">
                      <h3 className="font-heading text-base">{project.title}</h3>
                      <p className="mt-2 text-sm text-text-secondary">{project.summary}</p>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="mt-3 inline-flex text-sm text-accent transition hover:text-cyan-300"
                      >
                        View project
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.18}>
              <section id="principles" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
                <h2 className="font-heading text-2xl">Work principles</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {profile.workPrinciples.map((principle) => (
                    <article key={principle} className="rounded-xl border border-border bg-surface p-4">
                      <p className="text-sm leading-relaxed text-text-secondary">{principle}</p>
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.2}>
              <section className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
                <h2 className="font-heading text-2xl">{profile.personalNote.heading}</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-text-secondary">
                  {profile.personalNote.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.22}>
              <section className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
                <h2 className="font-heading text-2xl">Opportunities I am looking for</h2>
                <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                  {profile.opportunityTargets.map((target) => (
                    <li key={target}>- {target}</li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal delay={0.24}>
              <section id="ask-about-me">
                <ContextualAIAssistant
                  mode="about"
                  heading="Ask about my background"
                  helperText="Ask direct questions about my path, current focus, role direction, and project strengths. Answers stay grounded to portfolio data."
                  suggestedPrompts={profile.aboutAIPrompts}
                />
              </section>
            </Reveal>

            <Reveal delay={0.26}>
              <section>
                <h2 className="font-heading text-2xl">Active coding consistency</h2>
                <p className="mt-2 text-sm text-text-secondary">
                  A live contribution snapshot to show ongoing build rhythm.
                </p>
                <div className="mt-5">
                  <GithubHeatmap username="s-satyajit" />
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.28}>
              <section id="next-step" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
                <h2 className="font-heading text-2xl">Next steps</h2>
                <p className="mt-2 text-sm text-text-secondary">
                  If you want to evaluate my work quickly, start with these links.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ButtonLink href="/projects">View Projects</ButtonLink>
                  <ButtonLink href="/resume" variant="secondary">
                    Open Resume
                  </ButtonLink>
                  <ButtonLink href="/recruiters" variant="secondary">
                    View Recruiter Brief
                  </ButtonLink>
                  <ButtonLink href={githubLink} variant="secondary" external>
                    GitHub
                  </ButtonLink>
                  <ButtonLink href={linkedInLink} variant="secondary" external>
                    LinkedIn
                  </ButtonLink>
                  <ButtonLink href="/contact" variant="secondary">
                    Contact Me
                  </ButtonLink>
                </div>
              </section>
            </Reveal>
          </div>
        </div>
      </Container>
    </>
  );
}
