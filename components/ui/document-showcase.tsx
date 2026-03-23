"use client";

import { ChevronDown, ChevronUp, FileText, ScanSearch } from "lucide-react";
import { useState } from "react";

import { ButtonLink } from "@/components/ui/button-link";
import type { PdfSeoSignals } from "@/lib/pdf-seo";
import { cn } from "@/lib/utils";

interface DocumentSourceLink {
  label: string;
  href: string;
}

interface DocumentShowcaseProps {
  label: string;
  title: string;
  description: string;
  pdfUrl: string;
  seoSignals?: PdfSeoSignals | null;
  sourceLinks?: DocumentSourceLink[];
  previewEnabled?: boolean;
  defaultPreviewOpen?: boolean;
  previewHeightClass?: string;
  previewLabel?: string;
  showKeywordSignals?: boolean;
  compact?: boolean;
}

export function DocumentShowcase({
  label,
  title,
  description,
  pdfUrl,
  seoSignals,
  sourceLinks = [],
  previewEnabled = true,
  defaultPreviewOpen = false,
  previewHeightClass = "h-[520px] sm:h-[640px]",
  previewLabel = "Preview PDF",
  showKeywordSignals = true,
  compact = false
}: DocumentShowcaseProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(defaultPreviewOpen);
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(defaultPreviewOpen);

  const togglePreview = () => {
    setIsPreviewOpen((current) => {
      const next = !current;
      if (next) setIsPreviewLoaded(true);
      return next;
    });
  };

  const previewPdfUrl = pdfUrl.includes("#") ? `${pdfUrl}&zoom=page-width` : `${pdfUrl}#zoom=page-width`;

  return (
    <section
      className={cn(
        "mt-8 overflow-hidden rounded-2xl border border-border bg-surface-card",
        compact ? "" : "shadow-[0_20px_80px_rgba(6,12,24,0.3)]"
      )}
    >
      <div className={cn("border-b border-border", compact ? "p-5 sm:p-6" : "p-6 sm:p-8")}>
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">{label}</p>
        <h2 className={cn("mt-3 font-heading", compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl")}>
          {title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-secondary">{description}</p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <ButtonLink href={pdfUrl} variant="secondary" className="gap-2" external>
            <FileText className="h-4 w-4" />
            Open Full PDF
          </ButtonLink>
          <a
            href={pdfUrl}
            download
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-surface transition hover:bg-cyan-300"
          >
            <ScanSearch className="h-4 w-4" />
            Download PDF
          </a>
          {sourceLinks.map((source) => (
            <ButtonLink key={source.href} href={source.href} variant="secondary" className="gap-2" external>
              {source.label}
            </ButtonLink>
          ))}
        </div>

        {showKeywordSignals && seoSignals?.keywords?.length ? (
          <div className="mt-5 rounded-xl border border-border bg-surface p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
              Search terms inferred from document
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {seoSignals.keywords.slice(0, 10).map((keyword) => (
                <span key={keyword} className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {previewEnabled ? (
        <div className="p-4 sm:p-5">
          <button
            type="button"
            onClick={togglePreview}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/40 hover:text-text-primary"
            aria-expanded={isPreviewOpen}
          >
            {previewLabel}
            {isPreviewOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {isPreviewOpen ? (
            <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-surface">
              {isPreviewLoaded ? (
                <iframe src={previewPdfUrl} title={`${title} PDF`} className={cn("w-full", previewHeightClass)} />
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
