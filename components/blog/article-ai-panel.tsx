"use client";

import { FormEvent, useState } from "react";

type BlogAIMode = "summary" | "takeaways" | "simple" | "faq" | "ask";

interface ArticleAIPanelProps {
  slug: string;
}

const modeLabels: Record<Exclude<BlogAIMode, "ask">, string> = {
  summary: "AI Summary",
  takeaways: "Key Takeaways",
  simple: "Simplify",
  faq: "Generate FAQ"
};

export function ArticleAIPanel({ slug }: ArticleAIPanelProps) {
  const [loadingMode, setLoadingMode] = useState<BlogAIMode | null>(null);
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function run(mode: BlogAIMode, inputQuestion?: string) {
    setLoadingMode(mode);
    setError(null);
    try {
      const response = await fetch("/api/blog-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, mode, question: inputQuestion })
      });
      const data = (await response.json()) as { answer?: string; message?: string };
      if (!response.ok || !data.answer) {
        throw new Error(data.message || "Unable to generate AI response");
      }
      setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingMode(null);
    }
  }

  async function onAsk(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;
    await run("ask", question.trim());
  }

  return (
    <section className="rounded-2xl border border-border bg-surface-card p-5">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        AI Reading Assistant
      </p>
      <p className="mt-2 text-sm text-text-secondary">
        Quick article summary, takeaways, simplified explanation, and contextual Q&A.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(modeLabels).map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => run(mode as Exclude<BlogAIMode, "ask">)}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
            disabled={loadingMode !== null}
          >
            {loadingMode === mode ? "..." : label}
          </button>
        ))}
      </div>

      <form onSubmit={onAsk} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask AI about this article..."
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
        />
        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-surface transition hover:bg-cyan-300"
          disabled={loadingMode !== null}
        >
          {loadingMode === "ask" ? "Thinking..." : "Ask"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
      {answer ? (
        <div className="mt-4 rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-text-secondary whitespace-pre-wrap">
          {answer}
        </div>
      ) : null}
    </section>
  );
}
