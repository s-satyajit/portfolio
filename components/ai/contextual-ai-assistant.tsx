"use client";

import { Bot, RotateCcw } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { getAIAssistantConfig } from "@/data/ai-assistant";
import { cn } from "@/lib/utils";
import { AIConfidence, AIContextMode, AIResponseBody } from "@/types/ai";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  confidence?: AIConfidence;
  sources?: string[];
}

interface ContextualAIAssistantProps {
  mode: AIContextMode;
  projectSlug?: string;
  projectTitle?: string;
  heading?: string;
  helperText?: string;
  suggestedPrompts?: string[];
  className?: string;
  compact?: boolean;
}

function buildMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ContextualAIAssistant({
  mode,
  projectSlug,
  projectTitle,
  heading,
  helperText,
  suggestedPrompts,
  className,
  compact = false
}: ContextualAIAssistantProps) {
  const config = useMemo(() => getAIAssistantConfig(mode, { projectTitle }), [mode, projectTitle]);
  const promptList = suggestedPrompts || config.suggestedPrompts;

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  async function runQuery(rawQuery: string) {
    const trimmed = rawQuery.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: buildMessageId(),
      role: "user",
      text: trimmed
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");

    try {
      const result = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          persona: config.persona,
          mode,
          projectSlug
        })
      });

      const data = (await result.json()) as AIResponseBody & { message?: string };
      if (!result.ok) throw new Error(data.message || "Unable to answer right now.");

      const assistantMessage: ChatMessage = {
        id: buildMessageId(),
        role: "assistant",
        text: data.answer,
        confidence: data.confidence,
        sources: data.sources
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to process the question right now."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runQuery(query);
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-surface-card",
        compact ? "p-5" : "p-6 sm:p-7",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            <Bot size={14} />
            {config.badge}
          </p>
          <h3 className={cn("mt-3 font-heading", compact ? "text-2xl" : "text-3xl")}>
            {heading || config.heading}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {helperText || config.helperText}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMessages([]);
            setQuery("");
            setError(null);
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
          disabled={messages.length === 0 && !query}
        >
          <RotateCcw size={13} />
          Clear
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {promptList.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => void runQuery(prompt)}
            disabled={loading}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/60 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor={`ai-query-${mode}`}>
          Ask portfolio AI
        </label>
        <input
          id={`ai-query-${mode}`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={config.placeholder}
          maxLength={500}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Thinking..." : config.submitLabel}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

      <div className="mt-4 space-y-3">
        {messages.length === 0 ? (
          <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary">
            {config.emptyState}
          </p>
        ) : null}

        {messages.map((message) => (
          <article
            key={message.id}
            className={cn(
              "rounded-xl border px-4 py-3",
              message.role === "assistant"
                ? "border-border bg-surface"
                : "border-accent/30 bg-accent-soft"
            )}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              {message.role === "assistant" ? "Assistant" : "Question"}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
              {message.text}
            </p>

            {message.role === "assistant" && message.sources?.length ? (
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-text-secondary">
                <span>Confidence: {message.confidence}</span>
                {message.sources.map((source) => (
                  <span key={source} className="rounded-full border border-border px-2 py-0.5">
                    {source}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
