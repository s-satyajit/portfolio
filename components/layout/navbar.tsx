"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/insights", label: "Research + Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  const renderedLinks = useMemo(
    () =>
      links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-text-secondary transition hover:text-text-primary"
          onClick={() => setOpen(false)}
        >
          {link.label}
        </Link>
      )),
    []
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-heading text-sm font-semibold uppercase tracking-[0.2em]">
          {profile.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">{renderedLinks}</nav>

        <div className="hidden md:block">
          <Link
            href="/resume"
            className="rounded-full border border-accent/40 bg-accent-soft px-4 py-2 text-xs font-medium text-accent transition hover:border-accent hover:bg-accent hover:text-surface"
          >
            Resume
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-text-primary md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border bg-surface-elevated px-4 transition-all md:hidden",
          open ? "max-h-80 py-4 opacity-100" : "max-h-0 overflow-hidden py-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-3">
          {renderedLinks}
          <Link
            href="/resume"
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex w-fit rounded-full border border-accent/40 bg-accent-soft px-4 py-2 text-xs font-medium text-accent"
          >
            Resume
          </Link>
        </nav>
      </div>
    </header>
  );
}
