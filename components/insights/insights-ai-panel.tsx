"use client";

import { FormEvent, useMemo, useState } from "react";
import { Bot, RotateCcw } from "lucide-react";

type InsightAIKind = "hub" | "research" | "case-study";
type InsightAIMode = "summary" | "key-points" | "simplify" | "next-read" | "ask";

interface InsightsAIPanelProps {
  kind: InsightAIKind;
  slug?: string;
  title?: string;
  heading?: string;
  helperText?: string;
  suggestedQuestions?: string[];
  className?: string;
}

const modeLabels: Record<Exclude<InsightAIMode, "ask">, string> = {
  summary: "Summary",
  "key-points": "Key Points",
  simplify: "Simplify",
  "next-read": "Next Read"
};

function defaultHeading(kind: InsightAIKind): string {
  if (kind === "research") return "AI Research Assistant";
  if (kind === "case-study") return "AI Case Study Assistant";
  return "AI Insights Navigator";
}

function defaultHelper(kind: InsightAIKind): string {
  if (kind === "research") {
    return "Get quick summaries, key ideas, and recruiter-friendly explanations from this research entry.";
  }
  if (kind === "case-study") {
    return "Ask for architecture breakdowns, decision reasoning, and practical takeaways from this case study.";
  }
  return "Ask AI to compare research and case studies, and discover what to read next based on your goal.";
}

function defaultPrompts(kind: InsightAIKind): string[] {
  if (kind === "research") {
    return [
      "Summarize this research in 30 seconds",
      "What is the main contribution here?",
      "Explain this in simpler language",
      "What should a recruiter notice first?"
    ];
  }
  if (kind === "case-study") {
    return [
      "Summarize this case study quickly",
      "What decision mattered most here?",
      "What engineering lesson stands out?",
      "What would be the next iteration?"
    ];
  }
  return [
    "Which insight should a recruiter read first?",
    "Which entry is best for AI-focused roles?",
    "Which case study shows system thinking?",
    "What should a client read first?"
  ];
}

function inferModeFromPrompt(prompt: string): Exclude<InsightAIMode, "ask"> {
  const lower = prompt.toLowerCase();
  if (lower.includes("simple")) return "simplify";
  if (lower.includes("next") || lower.includes("which")) return "next-read";
  if (lower.includes("key") || lower.includes("lesson") || lower.includes("decision")) {
    return "key-points";
  }
  return "summary";
}

export function InsightsAIPanel({
  kind,
  slug,
  title,
  heading,
  helperText,
  suggestedQuestions,
  className
}: InsightsAIPanelProps) {
  const prompts = useMemo(() => suggestedQuestions || defaultPrompts(kind), [kind, suggestedQuestions]);
  const [loadingMode, setLoadingMode] = useState<InsightAIMode | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function run(mode: InsightAIMode, currentQuestion?: string) {
    if ((kind === "research" || kind === "case-study") && !slug) return;

    setLoadingMode(mode);
    setError(null);

    try {
      const response = await fetch("/api/insights-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          slug,
          mode,
          question: currentQuestion
        })
      });

      const data = (await response.json()) as { answer?: string; message?: string };
      if (!response.ok || !data.answer) {
        throw new Error(data.message || "Unable to generate response right now.");
      }
      setAnswer(data.answer);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Unable to process your request."
      );
    } finally {
      setLoadingMode(null);
    }
  }

  async function onAsk(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    await run("ask", trimmed);
  }

  return (
    <section className={`rounded-2xl border border-border bg-surface-card p-5 sm:p-6 ${className || ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            <Bot size={14} />
            {kind === "hub" ? "Insights AI" : kind === "research" ? "Research AI" : "Case Study AI"}
          </p>
          <h3 className="mt-3 font-heading text-2xl">{heading || defaultHeading(kind)}</h3>
          <p className="mt-2 text-sm text-text-secondary">{helperText || defaultHelper(kind)}</p>
          {title ? <p className="mt-1 text-xs text-text-secondary">Context: {title}</p> : null}
        </div>

        <button
          type="button"
          onClick={() => {
            setAnswer("");
            setQuestion("");
            setError(null);
          }}
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
          disabled={!answer && !question}
        >
          <RotateCcw size={13} />
          Clear
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(modeLabels).map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => void run(mode as Exclude<InsightAIMode, "ask">)}
            disabled={loadingMode !== null}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/60 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMode === mode ? "..." : label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => void run(inferModeFromPrompt(prompt), prompt)}
            disabled={loadingMode !== null}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/60 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={onAsk} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="insights-ai-question" className="sr-only">
          Ask insights AI
        </label>
        <input
          id="insights-ai-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a contextual question..."
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-surface transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loadingMode !== null || !question.trim()}
        >
          {loadingMode === "ask" ? "Thinking..." : "Ask"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

      <div className="mt-4 rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-text-secondary">
        {answer || "Use AI controls above to get a quick analysis or ask a specific question."}
      </div>
    </section>
  );
}
