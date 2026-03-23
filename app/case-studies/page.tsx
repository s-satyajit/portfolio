import { InsightsAIPanel } from "@/components/insights/insights-ai-panel";
import { InsightsExplorer } from "@/components/insights/insights-explorer";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { caseStudyToInsightItem, sortInsightsByDateDesc } from "@/lib/insights";
import { getAllCaseStudies } from "@/lib/mdx";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Case Studies",
  description:
    "Summary-first case-study workspace with architecture decisions, key insights, and source PDFs as supporting depth.",
  path: "/case-studies"
});

export default async function CaseStudiesPage() {
  const entries = await getAllCaseStudies(true);
  const items = sortInsightsByDateDesc(entries.map(caseStudyToInsightItem));

  return (
    <>
      <PageHeader
        eyebrow="Case Studies"
        title="Decision-by-decision architecture and product analysis"
        description="Explore how problems were framed, options evaluated, and implementation choices justified."
        actions={
          <>
            <ButtonLink href="/insights" variant="secondary">
              All Insights
            </ButtonLink>
            <ButtonLink href="/research" variant="secondary">
              Research
            </ButtonLink>
          </>
        }
      />

      <Container className="space-y-10 pb-20">
        <InsightsExplorer
          items={items}
          mode="case-study"
          heading="Case Study Explorer"
          helperText="Scan summaries, themes, and tags first. Open a case study for full analysis and optional source PDF depth."
        />

        <InsightsAIPanel
          kind="hub"
          heading="Ask AI about case-study strengths"
          helperText="Get quick comparative views across system design choices, conclusions, and recruiter relevance."
          suggestedQuestions={[
            "Which case study is strongest for backend reasoning?",
            "Which case study best shows product thinking?",
            "What recurring engineering lesson appears across case studies?",
            "Which case study should a recruiter read first?"
          ]}
        />
      </Container>
    </>
  );
}
