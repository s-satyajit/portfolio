import { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { PageBackButton } from "@/components/layout/page-back-button";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  const contextualBackLabel = eyebrow
    ? `Go to previous page from ${eyebrow}`
    : "Go to previous page";

  return (
    <section className="py-14 sm:py-16">
      <Container>
        <div className="max-w-4xl">
          <div className="mb-3">
            <PageBackButton
              iconOnly
              ariaLabel={contextualBackLabel}
              titleText="Go back"
            />
          </div>
          {eyebrow ? (
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-accent">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-heading text-4xl sm:text-5xl">{title}</h1>
          <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
            {description}
          </p>
          {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </Container>
    </section>
  );
}
