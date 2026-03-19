import { Container } from "@/components/layout/container";
import { ProjectGrid } from "@/components/sections/project-grid";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { featuredProjects, projects } from "@/data/projects";
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
        title="Shipped work and product-focused builds"
        description="A mix of full-stack applications, dashboards, and practical engineering experiments."
      />

      <Container className="space-y-10 pb-20">
        <section>
          <h2 className="mb-4 font-heading text-2xl">Featured Case Studies</h2>
          <ProjectGrid projects={featuredProjects} />
        </section>

        <section>
          <h2 className="mb-4 font-heading text-2xl">Additional Projects</h2>
          <ProjectGrid projects={projects.filter((project) => !project.featured)} />
        </section>

        <div className="rounded-2xl border border-border bg-surface-card p-6 text-center">
          <p className="text-sm text-text-secondary">
            Looking for project fit by role? Start with recruiter-focused highlights.
          </p>
          <div className="mt-4">
            <ButtonLink href="/recruiters" variant="secondary">
              Recruiter Quick View
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
