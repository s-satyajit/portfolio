import { PortfolioAIPanel } from "@/components/ai/portfolio-ai-panel";
import { AboutPreviewSection } from "@/components/sections/about-preview-section";
import { ContactCtaSection } from "@/components/sections/contact-cta-section";
import { ContentPreviewSection } from "@/components/sections/content-preview-section";
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
    "Portfolio of Satyajit Samal: AI-integrated product work, full-stack engineering projects, research-driven thinking, and recruiter-friendly proof of execution.",
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

      <ContentPreviewSection
        id="research-preview"
        eyebrow="Research & Publications"
        title="Research-driven analysis behind practical implementation"
        description="Publication-oriented entries connecting AI concepts to product decisions and system tradeoffs."
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
        title="Implementation notes, architecture breakdowns, and engineering learnings"
        description="Articles focused on how products are designed and built, including tradeoffs and iteration decisions."
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
        title="Case-study analysis from real product contexts"
        description="Structured writeups covering problem framing, options considered, and implementation outcomes."
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
        eyebrow="Optional AI Layer"
        title="Use AI for fast portfolio navigation"
        description="For quick role-fit checks, project guidance, and current-focus questions. Responses stay constrained to portfolio context."
        className="pb-14 pt-8 sm:pb-16 sm:pt-10"
      >
        <PortfolioAIPanel />
      </Section>

      <ContactCtaSection />
    </>
  );
}
