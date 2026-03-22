"use client";

import { Check, Copy, Download, Printer } from "lucide-react";
import { useState } from "react";

interface ResumeActionPanelProps {
  summaryText: string;
  pdfHref: string;
}

export function ResumeActionPanel({ summaryText, pdfHref }: ResumeActionPanelProps) {
  const [copied, setCopied] = useState(false);

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-surface-card p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Resume Actions</p>
      <div className="mt-3 space-y-2">
        <button
          type="button"
          onClick={copySummary}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied recruiter summary" : "Copy recruiter summary"}
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
        >
          <Printer size={14} />
          Print web resume
        </button>

        <a
          href={pdfHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/35 bg-accent-soft px-3 py-2 text-sm font-medium text-accent transition hover:border-accent hover:bg-accent hover:text-surface"
        >
          <Download size={14} />
          Open PDF in new tab
        </a>
      </div>
    </section>
  );
}
