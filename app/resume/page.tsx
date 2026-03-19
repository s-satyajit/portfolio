import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { socialLinks } from "@/data/social-links";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Resume",
  description:
    "Online resume of Satyajit Samal with profile summary, selected work, and downloadable PDF.",
  path: "/resume"
});

export default function ResumePage() {
  return (
    <>
      <PageHeader
        eyebrow="Resume"
        title="Online resume + downloadable PDF"
        description="A concise profile summary for recruiters with project links, focus areas, and contact channels."
        actions={
          <ButtonLink href="/resume/Satyajit_Samal_Resume.pdf" external>
            Download PDF
          </ButtonLink>
        }
      />

      <Container className="pb-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border border-border bg-surface-card p-5">
            <h2 className="font-heading text-2xl">Profile</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{profile.longBio}</p>
            <p className="mt-3 text-sm text-text-secondary">{profile.availability.note}</p>
          </article>

          <article className="rounded-2xl border border-border bg-surface-card p-5">
            <h2 className="font-heading text-2xl">Links</h2>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  •{" "}
                  <a href={link.href} target="_blank" rel="noreferrer" className="text-accent">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                •{" "}
                <Link href="/projects" className="text-accent">
                  Projects
                </Link>
              </li>
              <li>
                •{" "}
                <Link href="/blog" className="text-accent">
                  Blog
                </Link>
              </li>
              <li>
                •{" "}
                <Link href="/research" className="text-accent">
                  Research
                </Link>
              </li>
            </ul>
          </article>
        </div>

        <article className="mt-6 rounded-2xl border border-border bg-surface-card p-5">
          <h2 className="font-heading text-2xl">Selected Projects</h2>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            {projects.slice(0, 5).map((project) => (
              <li key={project.slug}>
                • <a href={`/projects/${project.slug}`}>{project.title}</a> — {project.summary}
              </li>
            ))}
          </ul>
        </article>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface-card">
          <iframe
            src="/resume/Satyajit_Samal_Resume.pdf"
            title="Satyajit Samal Resume"
            className="h-[720px] w-full"
          />
        </div>
      </Container>
    </>
  );
}
