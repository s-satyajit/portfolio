"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { profile } from "@/data/profile";
import { socialLinks } from "@/data/social-links";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  matchPrefixes?: string[];
}

const links: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  {
    href: "/insights",
    label: "Research + Case Studies",
    matchPrefixes: ["/insights", "/research", "/case-studies"]
  },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
];

function isActiveRoute(pathname: string, item: NavItem): boolean {
  const prefixes = item.matchPrefixes || [item.href];

  return prefixes.some((prefix) => {
    if (prefix === "/") return pathname === "/";
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const mobileSocials = useMemo(() => socialLinks.slice(0, 3), []);

  return (
    <header className="sticky top-0 z-50 bg-surface/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group min-w-0">
          <p className="truncate font-heading text-sm font-semibold uppercase tracking-[0.22em]">
            {profile.name}
          </p>
          <p className="hidden truncate text-xs text-text-secondary transition group-hover:text-text-primary md:block">
            {profile.title}
          </p>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-surface-elevated/60 p-1 md:flex">
          {links.map((link) => {
            const active = isActiveRoute(pathname, link);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition",
                  active
                    ? "border border-accent/45 bg-accent-soft text-text-primary"
                    : "border border-transparent text-text-secondary hover:border-border hover:text-text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/recruiters"
            className="inline-flex items-center rounded-full border border-border px-3.5 py-2 text-xs font-medium text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
          >
            Recruiters
          </Link>
          <Link
            href="/resume"
            className="inline-flex items-center rounded-full border border-accent/40 bg-accent-soft px-3.5 py-2 text-xs font-medium text-accent transition hover:border-accent hover:bg-accent hover:text-surface"
          >
            Resume
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-text-primary md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border bg-surface-elevated px-4 transition-all md:hidden",
          open ? "max-h-[80vh] py-4 opacity-100" : "max-h-0 overflow-hidden py-0 opacity-0"
        )}
      >
        <nav className="grid gap-2">
          {links.map((link) => {
            const active = isActiveRoute(pathname, link);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm transition",
                  active
                    ? "border-accent/45 bg-accent-soft text-text-primary"
                    : "border-border bg-surface text-text-secondary hover:border-accent/40 hover:text-text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href="/resume"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center rounded-full border border-accent/40 bg-accent-soft px-3 py-2 text-xs font-medium text-accent"
          >
            Resume
          </Link>
          <Link
            href="/recruiters"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center rounded-full border border-border px-3 py-2 text-xs font-medium text-text-secondary"
          >
            Recruiter Brief
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {mobileSocials.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
