import Link from "next/link";

import { profile } from "@/data/profile";
import { socialLinks } from "@/data/social-links";

const quickLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/blog", label: "Blog" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" }
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-elevated">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <p className="font-heading text-lg">{profile.name}</p>
          <p className="max-w-sm text-sm text-text-secondary">
            Building practical AI-powered and full-stack products with clean UX and
            production-minded engineering.
          </p>
          <p className="text-xs text-accent">{profile.availability.note}</p>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-text-secondary">
            Quick Links
          </p>
          <ul className="space-y-2 text-sm text-text-secondary">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link className="transition hover:text-text-primary" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-text-secondary">Connect</p>
          <ul className="space-y-2 text-sm text-text-secondary">
            {socialLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-text-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 text-center text-xs text-text-secondary sm:px-6 lg:px-8">
        © {new Date().getFullYear()} {profile.name}. Official portfolio presence.
      </div>
    </footer>
  );
}
