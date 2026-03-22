"use client";

import { FormEvent, useState } from "react";
import { Bot, Copy, RotateCcw } from "lucide-react";

type BlogAIMode =
  | "summary"
  | "takeaways"
  | "simple"
  | "faq"
  | "recruiter-fit"
  | "client-fit"
  | "next-read"
  | "ask";

interface ArticleAIPanelProps {
  slug: string;
}

const modeLabels: Record<Exclude<BlogAIMode, "ask">, string> = {
  summary: "AI Summary",
  takeaways: "Key Takeaways",
  simple: "Simplify",
  faq: "Generate FAQ",
  "recruiter-fit": "Recruiter Lens",
  "client-fit": "Client Lens",
  "next-read": "Suggest Next Read"
};

const suggestedQuestions = [
  "What are the top 3 practical takeaways from this article?",
  "How is this relevant for recruiters evaluating my profile?",
  "How can a client use this thinking in a real project?",
  "Which related article or case study should I read next?"
];

export function ArticleAIPanel({ slug }: ArticleAIPanelProps) {
  const [loadingMode, setLoadingMode] = useState<BlogAIMode | null>(null);
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function run(mode: BlogAIMode, inputQuestion?: string) {
    setLoadingMode(mode);
    setError(null);
    setCopied(false);
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

  async function copyAnswer() {
    if (!answer) return;
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-surface-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            <Bot size={14} />
            AI Reading Assistant
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Fast article summary, recruiter/client context, FAQs, and grounded Q&A.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setAnswer("");
            setQuestion("");
            setError(null);
            setCopied(false);
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
            onClick={() => run(mode as Exclude<BlogAIMode, "ask">)}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loadingMode !== null}
          >
            {loadingMode === mode ? "..." : label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestedQuestions.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => run("ask", prompt)}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loadingMode !== null}
          >
            {prompt}
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
        <div className="mt-4 rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={copyAnswer}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
            >
              <Copy size={12} />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{answer}</p>
        </div>
      ) : null}
    </section>
  );
}
