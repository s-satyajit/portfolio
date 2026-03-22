import { ContextualAIAssistant } from "@/components/ai/contextual-ai-assistant";
import { Container } from "@/components/layout/container";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { projects } from "@/data/projects";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Projects",
  description:
    "Project portfolio of Satyajit Samal with product-focused case studies, engineering summaries, and live/GitHub links.",
  path: "/projects"
});

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Advanced product builds, shipped with intent"
        description="Explore full-stack products, technical experiments, and case-study-ready implementations with filters, search, and recruiter/client-focused discovery."
        actions={
          <>
            <ButtonLink href="/recruiters" variant="secondary">
              Recruiter Quick View
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Discuss a Project
            </ButtonLink>
          </>
        }
      />

      <Container className="space-y-10 pb-20">
        <section className="grid gap-4 rounded-3xl border border-border bg-surface-card p-5 sm:p-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-border bg-surface p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Recruiter Path
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Start with impact-first projects, then jump into case studies for architecture depth.
            </p>
            <div className="mt-4">
              <ButtonLink href="/recruiters" variant="secondary">
                Open Recruiter Brief
              </ButtonLink>
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Client Path</p>
            <p className="mt-2 text-sm text-text-secondary">
              Filter by live projects to quickly review product quality and delivery style.
            </p>
            <div className="mt-4">
              <ButtonLink href="/services" variant="secondary">
                View Services
              </ButtonLink>
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Deep-Dive Path
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Connect projects with research and writing for stronger context on engineering decisions.
            </p>
            <div className="mt-4">
              <ButtonLink href="/insights" variant="secondary">
                Open Insights
              </ButtonLink>
            </div>
          </article>
        </section>

        <ProjectsExplorer projects={projects} />

        <ContextualAIAssistant
          mode="homepage"
          heading="Ask AI to navigate my project portfolio"
          helperText="Use AI for a quick project shortlist by role fit, architecture relevance, or stack focus."
          suggestedPrompts={[
            "Which projects should recruiters review first?",
            "Which project best shows backend and auth depth?",
            "What should a client review first?",
            "Which projects have case studies?",
            "Which project best reflects AI integration direction?"
          ]}
          className="bg-surface-card"
        />
      </Container>
    </>
  );
}
