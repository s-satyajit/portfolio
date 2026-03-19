import { BlogHeading } from "@/types/blog";

interface TableOfContentsProps {
  headings: BlogHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <aside className="rounded-2xl border border-border bg-surface-card p-4">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        Table of Contents
      </p>
      <ul className="space-y-1.5 text-sm text-text-secondary">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pl-3" : ""}>
            <a className="hover:text-text-primary" href={`#${heading.id}`}>
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
