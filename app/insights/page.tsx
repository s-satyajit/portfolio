import Link from "next/link";

import { InsightsAIPanel } from "@/components/insights/insights-ai-panel";
import { InsightsExplorer } from "@/components/insights/insights-explorer";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { caseStudyToInsightItem, researchToInsightItem, sortInsightsByDateDesc } from "@/lib/insights";
import { getAllCaseStudies, getAllResearchEntries } from "@/lib/mdx";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Research + Case Studies",
  description:
    "Advanced insights hub combining research notes and case studies with interactive filtering, deep reading paths, and grounded AI guidance.",
  path: "/insights"
});

export default async function InsightsPage() {
  const [researchEntries, caseStudies] = await Promise.all([
    getAllResearchEntries(true),
    getAllCaseStudies(true)
  ]);

  const insightItems = sortInsightsByDateDesc([
    ...researchEntries.map(researchToInsightItem),
    ...caseStudies.map(caseStudyToInsightItem)
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Research intelligence and case-study depth in one advanced workspace"
        description="A unified exploration surface for technical writing, architecture reasoning, and decision-making quality across projects."
        actions={
          <>
            <ButtonLink href="/research" variant="secondary">
              Research
            </ButtonLink>
            <ButtonLink href="/case-studies" variant="secondary">
              Case Studies
            </ButtonLink>
          </>
        }
      />

      <Container className="space-y-10 pb-20">
        <section className="grid gap-4 rounded-3xl border border-border bg-surface-card p-5 sm:p-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-border bg-surface p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Recruiter Path</p>
            <p className="mt-2 text-sm text-text-secondary">
              Start with high-signal case studies, then review research notes for technical depth.
            </p>
            <div className="mt-4">
              <Link href="/recruiters" className="text-sm text-accent hover:text-cyan-300">
                Open recruiter brief
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Learning Path</p>
            <p className="mt-2 text-sm text-text-secondary">
              Use filters by topic and status to move from concept notes to implementation decisions.
            </p>
            <div className="mt-4">
              <Link href="/blog" className="text-sm text-accent hover:text-cyan-300">
                Open technical blog
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Execution Path</p>
            <p className="mt-2 text-sm text-text-secondary">
              Connect these analyses directly to shipped products in the projects section.
            </p>
            <div className="mt-4">
              <Link href="/projects" className="text-sm text-accent hover:text-cyan-300">
                Open projects
              </Link>
            </div>
          </article>
        </section>

        <InsightsExplorer
          items={insightItems}
          mode="all"
          heading="Insights Command Explorer"
          helperText="Navigate research and case studies by intent: recruiter screening, architecture review, or AI implementation depth."
        />

        <InsightsAIPanel kind="hub" />
      </Container>
    </>
  );
}
