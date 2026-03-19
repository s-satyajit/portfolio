import { Container } from "@/components/layout/container";
import { ExperienceFocusSection } from "@/components/sections/experience-focus-section";
import { GithubHeatmap } from "@/components/sections/github-heatmap";
import { PageHeader } from "@/components/ui/page-header";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Experience",
  description:
    "Experience timeline, current technical focus, and GitHub contribution consistency for Satyajit Samal.",
  path: "/experience"
});

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="Timeline, active work, and current focus"
        description="A practical view of ongoing development work, education track, and engineering consistency."
      />
      <ExperienceFocusSection />
      <Container className="pb-20">
        <GithubHeatmap username="s-satyajit" />
      </Container>
    </>
  );
}
