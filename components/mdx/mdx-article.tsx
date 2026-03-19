import { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { PageBackButton } from "@/components/layout/page-back-button";

interface MdxArticleProps {
  eyebrow?: string;
  title: string;
  meta: ReactNode;
  children: ReactNode;
}

export function MdxArticle({ eyebrow, title, meta, children }: MdxArticleProps) {
  return (
    <article className="py-16 sm:py-20">
      <Container className="max-w-4xl">
        <header className="mb-10 space-y-4">
          <PageBackButton iconOnly />
          {eyebrow ? (
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">{eyebrow}</p>
          ) : null}
          <h1 className="font-heading text-4xl leading-tight sm:text-5xl">{title}</h1>
          <div className="text-sm text-text-secondary">{meta}</div>
        </header>
        <div className="prose prose-invert max-w-none">{children}</div>
      </Container>
    </article>
  );
}
