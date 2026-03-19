import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { featuredProjects } from "@/data/projects";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { buildPageMetadata } from "@/lib/seo";

const roleFit = [
  "AI Engineer Intern",
  "Full-Stack Developer",
  "AI Product Engineer",
  "Frontend Engineer (Product-focused)"
];

export const metadata = buildPageMetadata({
  title: "Recruiter Brief",
  description:
    "Recruiter-focused summary of Satyajit Samal’s fit, strengths, featured projects, and contact paths.",
  path: "/recruiters"
});

export default function RecruitersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Recruiter Brief"
        title="Fast hiring-context summary"
        description="Built for quick screening: role fit, strongest stack areas, top projects, and direct next steps."
      />
      <Container className="space-y-6 pb-20">
        <section className="rounded-2xl border border-border bg-surface-card p-5">
          <h2 className="font-heading text-2xl">30-second summary</h2>
          <p className="mt-3 text-sm text-text-secondary">
            {profile.name} is an AI-focused engineer with full-stack foundations, currently
            pursuing an M.E. in AI at Chandigarh University. Builds practical web products,
            AI-integrated workflows, and deployment-ready interfaces with a strong product mindset.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface-card p-5">
          <h2 className="font-heading text-2xl">Role fit</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {roleFit.map((role) => (
              <span
                key={role}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary"
              >
                {role}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface-card p-5">
          <h2 className="font-heading text-2xl">Strongest stack zones</h2>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            {skillGroups.slice(0, 3).map((group) => (
              <li key={group.title}>
                • <span className="text-text-primary">{group.title}:</span> {group.items.join(", ")}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface-card p-5">
          <h2 className="font-heading text-2xl">Top projects for hiring review</h2>
          <ul className="mt-3 space-y-3 text-sm text-text-secondary">
            {featuredProjects.map((project) => (
              <li key={project.slug}>
                • <a href={`/projects/${project.slug}`}>{project.title}</a> — {project.summary}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface-card p-5">
          <h2 className="font-heading text-2xl">Next step</h2>
          <p className="mt-3 text-sm text-text-secondary">
            For role discussions, include team context, role scope, and expected impact area.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href="/contact">Contact</ButtonLink>
            <ButtonLink href="/resume" variant="secondary">
              Resume
            </ButtonLink>
          </div>
        </section>
      </Container>
    </>
  );
}
