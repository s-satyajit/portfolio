import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { GithubHeatmap } from "@/components/sections/github-heatmap";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { SchemaScript } from "@/components/ui/schema-script";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { socialLinks } from "@/data/social-links";
import { buildPageMetadata } from "@/lib/seo";
import { profilePageSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "About",
  description:
    "Learn about Satyajit Samal’s background, education, technical direction, and active engineering focus in AI + full-stack development.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <SchemaScript
        schema={profilePageSchema(
          "/about",
          "About Satyajit Samal",
          "Background, education, and engineering direction."
        )}
      />
      <PageHeader
        eyebrow="About"
        title="Satyajit Samal"
        description={profile.longBio}
        actions={
          <>
            <ButtonLink href="/resume">View Resume</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Contact
            </ButtonLink>
          </>
        }
      />

      <Container className="pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-2xl border border-border bg-surface-card p-5">
            <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-2xl border border-border">
              <Image
                src={profile.image}
                alt={`${profile.name} portrait`}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
            <p className="text-center font-heading text-xl">{profile.name}</p>
            <p className="mt-1 text-center text-sm text-text-secondary">{profile.title}</p>
            <p className="mt-4 text-center text-sm text-text-secondary">{profile.location}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <article className="rounded-2xl border border-border bg-surface-card p-5">
              <h2 className="font-heading text-2xl">Profile</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{profile.bio}</p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                I am currently pursuing an M.E. in AI at Chandigarh University, with a B.Tech CSE
                foundation. I focus on practical AI products, clear backend architecture, and
                trustworthy user experiences.
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-surface-card p-5">
              <h2 className="font-heading text-2xl">Technical Breadth</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {skillGroups.map((group) => (
                  <div key={group.title} className="rounded-xl border border-border bg-surface p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                      {group.title}
                    </p>
                    <p className="mt-2 text-sm text-text-secondary">{group.items.join(" • ")}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-surface-card p-5">
          <h2 className="font-heading text-2xl">Explore My Work</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Use this page as the hub for projects, writing, case studies, and research direction.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/projects"
              className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
            >
              Blog
            </Link>
            <Link
              href="/case-studies"
              className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
            >
              Case Studies
            </Link>
            <Link
              href="/research"
              className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
            >
              Research
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent transition hover:border-accent hover:bg-accent hover:text-surface"
            >
              Contact
            </Link>
          </div>
        </section>

        <div className="mt-8">
          <GithubHeatmap username="s-satyajit" />
        </div>
      </Container>
    </>
  );
}
