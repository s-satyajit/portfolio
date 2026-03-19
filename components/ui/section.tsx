import { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className
}: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-20", className)}>
      <Container>
        <div className="mb-10 max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-accent">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-heading text-3xl sm:text-4xl">{title}</h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-text-secondary">{description}</p>
          ) : null}
        </div>
        {children}
      </Container>
    </section>
  );
}
