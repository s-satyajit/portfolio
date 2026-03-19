"use client";

import { Sparkles } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { aiSuggestedPrompts } from "@/data/ai-grounding";
import { AIPersona, AIResponseBody } from "@/types/ai";

const personaOptions: Array<{ value: AIPersona; label: string }> = [
  { value: "general", label: "General" },
  { value: "recruiter", label: "Recruiter" },
  { value: "client", label: "Client" },
  { value: "collaborator", label: "Collaborator" }
];

export function PortfolioAIPanel() {
  const [query, setQuery] = useState("");
  const [persona, setPersona] = useState<AIPersona>("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AIResponseBody | null>(null);

  const promptList = useMemo(() => aiSuggestedPrompts.slice(0, 6), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const result = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, persona })
      });

      const data = (await result.json()) as AIResponseBody & { message?: string };
      if (!result.ok) throw new Error(data.message || "Request failed");
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate response");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-border bg-surface-card p-6 sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            <Sparkles size={14} /> Portfolio AI
          </p>
          <h3 className="font-heading text-2xl">Ask My Portfolio</h3>
          <p className="mt-2 text-sm text-text-secondary">
            Grounded assistant for recruiter and client questions. No invented claims.
          </p>
        </div>

        <label className="text-xs text-text-secondary">
          Persona
          <select
            value={persona}
            onChange={(event) => setPersona(event.target.value as AIPersona)}
            className="mt-1 block rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
          >
            {personaOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask about projects, stack strengths, role fit, research, or service capability..."
          className="min-h-28 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent"
          maxLength={500}
          aria-label="Ask portfolio AI"
        />

        <div className="flex flex-wrap gap-2">
          {promptList.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setQuery(prompt)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
            >
              {prompt}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Thinking..." : "Run Query"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

      {response ? (
        <div className="mt-6 rounded-2xl border border-border bg-surface/80 p-5">
          <p className="text-sm leading-relaxed text-text-primary">{response.answer}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-text-secondary">
            <span>Confidence: {response.confidence}</span>
            {response.sources.map((source) => (
              <span key={source} className="rounded-full border border-border px-2 py-0.5">
                {source}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
