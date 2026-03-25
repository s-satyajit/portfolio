import Image from "next/image";
import Link from "next/link";

import { ScrollSyncedSidebar } from "@/components/about/scroll-synced-sidebar";
import { ContextualAIAssistant } from "@/components/ai/contextual-ai-assistant";
import { Container } from "@/components/layout/container";
import { ResumeActionPanel } from "@/components/resume/resume-action-panel";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { SchemaScript } from "@/components/ui/schema-script";
import { currentlyBuilding } from "@/data/currently-building";
import { experienceTimeline } from "@/data/experience";
import { profile } from "@/data/profile";
import { getProjects } from "@/data/projects";
import {
  resumeAiPrompts,
  resumeEvaluationChecklist,
  resumeFocusTracks,
  resumePdfPath,
  resumeSectionLinks,
  resumeSignals,
  resumeSummaryHighlights,
  resumeWorkPrinciples
} from "@/data/resume";
import { recruiterRoleFit } from "@/data/recruiter-brief";
import { skillGroups } from "@/data/skills";
import { socialLinks } from "@/data/social-links";
import { getAllBlogPosts, getAllCaseStudies, getAllResearchEntries } from "@/lib/mdx";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbSchema, profilePageSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Resume",
  description:
    "Advanced online resume of Satyajit Samal with role-fit clarity, project evidence, technical depth, and downloadable PDF.",
  path: "/resume"
});

const stageLabel: Record<(typeof currentlyBuilding)[number]["stage"], string> = {
  building: "Building",
  researching: "Researching",
  shipping: "Shipping"
};

export default async function ResumePage() {
  const projects = getProjects();

  const [blogPosts, researchEntries, caseStudies] = await Promise.all([
    getAllBlogPosts(true),
    getAllResearchEntries(true),
    getAllCaseStudies(true)
  ]);

  const featuredProjects = projects.filter((item) => item.featured).slice(0, 4);
  const liveProjects = projects.filter((item) => item.status === "live");
  const caseStudyBackedProjects = projects.filter((item) => item.hasCaseStudy);
  const currentEducation =
    profile.education.find((item) => item.status === "ongoing") || profile.education[0];

  const githubLink =
    socialLinks.find((item) => item.label === "GitHub")?.href || "https://github.com/s-satyajit";
  const linkedInLink =
    socialLinks.find((item) => item.label === "LinkedIn")?.href ||
    "https://www.linkedin.com/in/satyajitsamal/";

  const recruiterSummary = [
    `${profile.name} is an ${profile.title} currently pursuing ${currentEducation.degree} in ${currentEducation.field} at ${currentEducation.institution}.`,
    "He builds practical full-stack products with strong frontend clarity, backend workflow reliability, and applied AI integration.",
    "Best suited for frontend, full-stack, and applied AI product engineering roles with real execution ownership."
  ].join(" ");
  const resumePreviewUrl = resumePdfPath.includes("#")
    ? `${resumePdfPath}&zoom=page-width`
    : `${resumePdfPath}#zoom=page-width`;

  return (
    <>
      <SchemaScript
        schema={[
          profilePageSchema(
            "/resume",
            "Resume - Satyajit Samal",
            "Professional resume page with recruiter-ready evaluation signals and verified project evidence."
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Resume", path: "/resume" }
          ])
        ]}
      />

      <PageHeader
        eyebrow="Resume"
        title="Industry-ready resume workspace"
        description="A recruiter-focused resume view with role fit, technical evidence, writing depth, and direct action paths."
        actions={
          <>
            <ButtonLink href={resumePdfPath} external>
              Download PDF
            </ButtonLink>
            <ButtonLink href="/recruiters" variant="secondary">
              Recruiter Brief
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Contact
            </ButtonLink>
          </>
        }
      />

      <Container className="space-y-8 overflow-x-hidden pb-20 sm:overflow-x-visible">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-border bg-surface-card p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Projects</p>
            <p className="mt-2 text-sm text-text-secondary">
              {liveProjects.length} live builds, {featuredProjects.length} featured
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-surface-card p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Case-Study Coverage
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              {caseStudyBackedProjects.length} projects linked to case-study analysis
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-surface-card p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Writing Depth
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              {blogPosts.length} blog posts, {researchEntries.length} research entries
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-surface-card p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Current Program
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              {currentEducation.degree} in {currentEducation.field}
            </p>
          </article>
        </section>

        <section className="relative z-30 rounded-2xl border border-border bg-surface-card p-3 backdrop-blur sm:sticky sm:top-16 sm:-mx-4 sm:rounded-none sm:border-x-0 sm:border-y sm:bg-surface/95 sm:px-4 sm:py-3 xl:hidden">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">On This Page</p>
          <nav className="mt-2 flex flex-wrap gap-2 sm:flex-nowrap sm:overflow-x-auto sm:pb-1">
            {resumeSectionLinks.map((item) => (
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

        <div className="min-w-0 grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <ScrollSyncedSidebar className="scrollbar-hide relative space-y-6 xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:overscroll-contain">
            <section className="rounded-2xl border border-border bg-surface-card p-5">
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-2xl border border-border">
                <Image
                  src={profile.image}
                  alt={`${profile.name} portrait`}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-center font-heading text-xl">{profile.name}</p>
              <p className="mt-1 text-center text-sm text-text-secondary">{profile.title}</p>
              <p className="mt-1 text-center text-sm text-text-secondary">{profile.location}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
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

            <section className="rounded-2xl border border-border bg-surface-card p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                Resume Snapshot
              </p>
              <dl className="mt-3 space-y-3">
                {resumeSignals.map((signal) => (
                  <div key={signal.label} className="rounded-xl border border-border bg-surface p-3">
                    <dt className="text-xs uppercase tracking-[0.16em] text-text-secondary">
                      {signal.label}
                    </dt>
                    <dd className="ml-0 mt-1 text-sm text-text-primary">{signal.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="hidden rounded-2xl border border-border bg-surface-card p-5 xl:block">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                On This Page
              </p>
              <nav className="mt-3 space-y-2">
                {resumeSectionLinks.map((item) => (
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

            <ResumeActionPanel summaryText={recruiterSummary} pdfHref={resumePdfPath} />
          </ScrollSyncedSidebar>

          <div className="min-w-0 space-y-6">
            <section id="executive-summary" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">Executive summary</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{profile.longBio}</p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                {resumeSummaryHighlights.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </section>

            <section id="role-fit" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">Role fit and recruiter evaluation</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Fast role mapping and practical fit based on shipped work.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {recruiterRoleFit.map((item) => (
                  <article key={item.role} className="rounded-xl border border-border bg-surface p-4">
                    <h3 className="font-heading text-lg">{item.role}</h3>
                    <p className="mt-2 text-sm text-text-secondary">{item.reason}</p>
                  </article>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {resumeEvaluationChecklist.map((item) => (
                  <article key={item.title} className="rounded-xl border border-border bg-surface p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                      Screening Check
                    </p>
                    <h3 className="mt-2 font-heading text-base">{item.title}</h3>
                    <p className="mt-2 text-sm text-text-secondary">{item.detail}</p>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="experience-timeline"
              className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6"
            >
              <h2 className="font-heading text-2xl">Experience timeline</h2>
              <div className="mt-4 space-y-3">
                {experienceTimeline.map((item) => (
                  <article key={item.id} className="rounded-xl border border-border bg-surface p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-heading text-lg">{item.role}</h3>
                        <p className="text-sm text-text-secondary">
                          {item.company} | {item.location}
                        </p>
                      </div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                        {item.startDate} to {item.endDate}
                      </p>
                    </div>
                    <ul className="mt-3 space-y-1 text-sm text-text-secondary">
                      {item.highlights.map((highlight) => (
                        <li key={highlight}>- {highlight}</li>
                      ))}
                    </ul>
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

            <section id="skills-matrix" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">Skills matrix</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Grouped by implementation context for faster screening.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {skillGroups.map((group) => (
                  <article key={group.title} className="rounded-xl border border-border bg-surface p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                      {group.title}
                    </p>
                    <p className="mt-2 text-sm text-text-secondary">{group.items.join(", ")}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="project-evidence" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">Project evidence</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Selected work with direct navigation to implementation detail.
              </p>
              <div className="mt-4 space-y-3">
                {featuredProjects.map((project) => (
                  <article key={project.slug} className="rounded-xl border border-border bg-surface p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-heading text-lg">{project.title}</h3>
                      <span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-xs text-accent">
                        {project.category}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">{project.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-border px-2.5 py-1 text-xs text-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <ButtonLink href={`/projects/${project.slug}`} variant="secondary">
                        View Project
                      </ButtonLink>
                      {project.links.caseStudy ? (
                        <ButtonLink href={project.links.caseStudy} variant="secondary">
                          Case Study
                        </ButtonLink>
                      ) : null}
                      {project.links.live ? (
                        <ButtonLink href={project.links.live} external variant="secondary">
                          Live Demo
                        </ButtonLink>
                      ) : null}
                      {project.links.github ? (
                        <ButtonLink href={project.links.github} external variant="secondary">
                          GitHub
                        </ButtonLink>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="writing-and-research"
              className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6"
            >
              <h2 className="font-heading text-2xl">Writing and research depth</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <article className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Blog</p>
                  <p className="mt-2 text-sm text-text-secondary">{blogPosts.length} entries</p>
                  <Link href="/blog" className="mt-2 inline-flex text-sm text-accent hover:text-cyan-300">
                    Explore blog
                  </Link>
                </article>
                <article className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Research
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">{researchEntries.length} entries</p>
                  <Link href="/research" className="mt-2 inline-flex text-sm text-accent hover:text-cyan-300">
                    Explore research
                  </Link>
                </article>
                <article className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    Case Studies
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">{caseStudies.length} entries</p>
                  <Link
                    href="/case-studies"
                    className="mt-2 inline-flex text-sm text-accent hover:text-cyan-300"
                  >
                    Explore case studies
                  </Link>
                </article>
              </div>
            </section>

            <section id="currently-building" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">Currently building</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
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

            <section id="work-principles" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">Work principles and focus tracks</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {resumeWorkPrinciples.map((item) => (
                  <article key={item.title} className="rounded-xl border border-border bg-surface p-4">
                    <h3 className="font-heading text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm text-text-secondary">{item.detail}</p>
                  </article>
                ))}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {resumeFocusTracks.map((item) => (
                  <article key={item.title} className="rounded-xl border border-border bg-surface p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Focus</p>
                    <h3 className="mt-2 font-heading text-base">{item.title}</h3>
                    <p className="mt-2 text-sm text-text-secondary">{item.detail}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="resume-ai">
              <ContextualAIAssistant
                mode="resume"
                heading="Resume AI brief assistant"
                helperText="Ask role-fit, project-priority, and technical-depth questions with grounded, recruiter-ready answers."
                suggestedPrompts={resumeAiPrompts}
              />
            </section>

            <section id="resume-pdf" className="rounded-2xl border border-border bg-surface-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-2xl">PDF resume preview</h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    Use this embedded view or open the file directly for download and sharing.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ButtonLink href={resumePdfPath} external>
                    Download PDF
                  </ButtonLink>
                  <ButtonLink href={resumePdfPath} external variant="secondary">
                    Open in New Tab
                  </ButtonLink>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
                <iframe
                  src={resumePreviewUrl}
                  title={`${profile.name} Resume`}
                  className="h-[760px] w-full"
                />
              </div>
            </section>
          </div>
        </div>
      </Container>
    </>
  );
}
