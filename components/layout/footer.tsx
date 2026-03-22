import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import Link from "next/link";

import { currentlyBuilding } from "@/data/currently-building";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/social-links";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/insights", label: "Research + Case Studies" },
  { href: "/blog", label: "Blog" }
];

const proofLinks = [
  { href: "/resume", label: "Resume" },
  { href: "/recruiters", label: "Recruiter Brief" },
  { href: "/research", label: "Research" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/services", label: "Services" }
];

const footerTechTags = ["Next.js App Router", "TypeScript", "Tailwind CSS", "MDX", "Gemini API"];

export function Footer() {
  const featuredBuilds = currentlyBuilding.slice(0, 2);

  return (
    <footer className="border-t border-border bg-surface-elevated/80">
      <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid gap-5 rounded-3xl border border-border bg-surface-card p-5 sm:p-6 lg:grid-cols-[1.4fr_1fr_auto]">
          <div>
            <p className="font-heading text-xl">{profile.name}</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
              Building practical AI-powered and full-stack products with clear UX, reliable systems,
              and production-minded engineering decisions.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-accent/35 bg-accent-soft px-3 py-1 text-xs text-accent">
                {profile.title}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary">
                {profile.location}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary">
                {profile.availability.note}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Now Building</p>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {featuredBuilds.map((item) => (
                <li key={item.id}>
                  <p className="text-text-primary">{item.title}</p>
                  <p className="mt-1 text-xs text-text-secondary">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-accent/40 bg-accent-soft px-4 py-2 text-sm font-medium text-accent transition hover:border-accent hover:bg-accent hover:text-surface"
            >
              Start a Conversation
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
            >
              Open Resume
            </Link>
            <Link
              href="/recruiters"
              className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
            >
              Recruiter Brief
            </Link>
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <section className="space-y-3">
            <p className="font-heading text-lg">Professional Snapshot</p>
            <p className="text-sm text-text-secondary">{profile.bio}</p>
            <p className="inline-flex items-center gap-2 text-sm text-text-secondary">
              <Mail size={14} className="text-accent" />
              <a href={`mailto:${profile.email}`} className="transition hover:text-text-primary">
                {profile.email}
              </a>
            </p>
            <p className="inline-flex items-center gap-2 text-sm text-text-secondary">
              <MapPin size={14} className="text-accent" />
              {profile.location}
            </p>
          </section>

          <nav aria-label="Explore links">
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-text-secondary">Explore</p>
            <ul className="space-y-2 text-sm text-text-secondary">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link className="transition hover:text-text-primary" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Proof links">
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-text-secondary">
              Proof + Paths
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              {proofLinks.map((item) => (
                <li key={item.href}>
                  <Link className="transition hover:text-text-primary" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section>
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-text-secondary">Connect</p>
            <ul className="space-y-2 text-sm text-text-secondary">
              {socialLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 transition hover:text-text-primary"
                  >
                    {item.label}
                    <ArrowUpRight size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-4 border-t border-border pt-5">
          <div className="flex flex-wrap gap-2">
            {footerTechTags.map((tag) => (
              <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-secondary">
            <p>(c) {new Date().getFullYear()} {profile.name}. Official portfolio presence.</p>
            <div className="flex flex-wrap items-center gap-4">
              <p>Designed for recruiter trust and client clarity.</p>
              <Link href="#top" className="text-accent transition hover:text-cyan-300">
                Back to top
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
