import { InsightsAIPanel } from "@/components/insights/insights-ai-panel";
import { InsightsExplorer } from "@/components/insights/insights-explorer";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { researchToInsightItem, sortInsightsByDateDesc } from "@/lib/insights";
import { getAllResearchEntries } from "@/lib/mdx";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Research & Publications",
  description:
    "Advanced research workspace with publication statuses, contribution summaries, filters, and grounded AI reading support.",
  path: "/research"
});

export default async function ResearchPage() {
  const entries = await getAllResearchEntries(true);
  const items = sortInsightsByDateDesc(entries.map(researchToInsightItem));

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Research and publication track with deeper technical context"
        description="Explore abstracts, contribution scope, status progression, and AI-assisted quick interpretation."
        actions={
          <>
            <ButtonLink href="/insights" variant="secondary">
              All Insights
            </ButtonLink>
            <ButtonLink href="/case-studies" variant="secondary">
              Case Studies
            </ButtonLink>
          </>
        }
      />

      <Container className="space-y-10 pb-20">
        <InsightsExplorer
          items={items}
          mode="research"
          heading="Research Explorer"
          helperText="Filter by status, tags, and timeline to review technical direction and publication readiness."
        />

        <InsightsAIPanel
          kind="hub"
          heading="Ask AI about my research direction"
          helperText="Get quick guidance on publication status, contribution patterns, and what to read first."
          suggestedQuestions={[
            "Which research entry best reflects AI reliability focus?",
            "What is the current publication stage across entries?",
            "Which research note should a recruiter read first?",
            "What themes are recurring in these research notes?"
          ]}
        />
      </Container>
    </>
  );
}
