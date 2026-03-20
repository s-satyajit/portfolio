import { PortfolioAIPanel } from "@/components/ai/portfolio-ai-panel";
import { AboutPreviewSection } from "@/components/sections/about-preview-section";
import { CapabilitiesSection } from "@/components/sections/capabilities-section";
import { ContactCtaSection } from "@/components/sections/contact-cta-section";
import { ContentPreviewSection } from "@/components/sections/content-preview-section";
import { ExperienceFocusSection } from "@/components/sections/experience-focus-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProofStripSection } from "@/components/sections/proof-strip-section";
import { Section } from "@/components/ui/section";
import { SchemaScript } from "@/components/ui/schema-script";
import { buildPageMetadata } from "@/lib/seo";
import { profilePageSchema } from "@/lib/schema";
import { getAllBlogPosts, getAllCaseStudies, getAllResearchEntries } from "@/lib/mdx";

export const metadata = buildPageMetadata({
  title: "Satyajit Samal - AI Engineer + Full-Stack Developer",
  description:
    "Official portfolio of Satyajit Samal showcasing AI-integrated products, full-stack projects, research thinking, and practical engineering execution.",
  path: "/"
});

export default async function HomePage() {
  const [blogPosts, researchEntries, caseStudies] = await Promise.all([
    getAllBlogPosts(true),
    getAllResearchEntries(true),
    getAllCaseStudies(true)
  ]);

  return (
    <>
      <SchemaScript
        schema={profilePageSchema(
          "/",
          "Satyajit Samal - Official Portfolio",
          "AI Engineer + Full-Stack Developer portfolio website."
        )}
      />
      <HeroSection />
      <ProofStripSection />
      <FeaturedProjectsSection />

      <CapabilitiesSection />
      <ExperienceFocusSection />

      <ContentPreviewSection
        id="research-preview"
        eyebrow="Research & Publications"
        title="Analytical depth through research-driven work"
        description="Publication-oriented entries and technical analysis in progress."
        viewAllHref="/research"
        viewAllLabel="View Research"
        items={researchEntries.slice(0, 3).map((entry) => ({
          title: entry.title,
          summary: entry.summary,
          href: `/research/${entry.slug}`,
          meta: entry.status
        }))}
      />

      <ContentPreviewSection
        id="blog-preview"
        eyebrow="Blog / Insights"
        title="Implementation notes, product decisions, and AI engineering learnings"
        description="Writing that explains how things are built, not just what was built."
        viewAllHref="/blog"
        viewAllLabel="Read Blog"
        items={blogPosts.slice(0, 3).map((entry) => ({
          title: entry.title,
          summary: entry.excerpt,
          href: `/blog/${entry.slug}`,
          meta: entry.readTime
        }))}
      />

      <ContentPreviewSection
        id="case-preview"
        eyebrow="Case Studies"
        title="Structured thinking behind product and architecture decisions"
        description="Polished analytical writeups from real implementation contexts."
        viewAllHref="/case-studies"
        viewAllLabel="Explore Case Studies"
        items={caseStudies.slice(0, 3).map((entry) => ({
          title: entry.title,
          summary: entry.conclusion,
          href: `/case-studies/${entry.slug}`,
          meta: "analysis"
        }))}
      />

      <AboutPreviewSection />

      <Section
        id="ai-panel"
        eyebrow="Quick Q&A"
        title="Ask for a fast portfolio summary"
        description="Use the assistant for role-fit checks, project selection, or current-focus questions. Answers stay constrained to portfolio context."
        className="pb-14 pt-8 sm:pb-16 sm:pt-10"
      >
        <PortfolioAIPanel />
      </Section>

      <ContactCtaSection />
    </>
  );
}
