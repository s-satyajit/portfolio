import { FileText, ScanSearch } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import type { PdfSeoSignals } from "@/lib/pdf-seo";

interface DocumentShowcaseProps {
  label: string;
  title: string;
  description: string;
  pdfUrl: string;
  seoSignals?: PdfSeoSignals | null;
}

export function DocumentShowcase({
  label,
  title,
  description,
  pdfUrl,
  seoSignals
}: DocumentShowcaseProps) {
  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-border bg-surface-card/80 shadow-[0_20px_80px_rgba(6,12,24,0.35)]">
      <div className="relative border-b border-border p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,255,0.18),transparent_45%),linear-gradient(120deg,rgba(56,189,248,0.08),rgba(7,11,19,0))]" />
        <div className="relative">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">{label}</p>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-secondary">{description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={pdfUrl} variant="secondary" className="gap-2" external>
              <FileText className="h-4 w-4" />
              Open PDF
            </ButtonLink>
            <ButtonLink href={pdfUrl} className="gap-2" external>
              <ScanSearch className="h-4 w-4" />
              Download PDF
            </ButtonLink>
          </div>

          {seoSignals?.keywords.length ? (
            <div className="mt-6 rounded-2xl border border-border bg-surface-elevated/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
                Search terms inferred from document
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {seoSignals.keywords.slice(0, 10).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="bg-[linear-gradient(180deg,rgba(7,11,19,0.86),rgba(11,18,32,0.98))] p-4 sm:p-5">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <iframe src={pdfUrl} title={`${title} PDF`} className="h-[760px] w-full" />
        </div>
      </div>
    </section>
  );
}
