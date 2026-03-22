"use client";

import { Bot, MessageSquareText, RotateCcw, Send, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { getAIAssistantConfig } from "@/data/ai-assistant";
import { resolveFloatingAssistantContext } from "@/lib/floating-assistant-context";
import { cn } from "@/lib/utils";
import { AIConfidence, AIPersona, AIResponseBody } from "@/types/ai";

type ChatRole = "user" | "assistant";
type PersonaPicker = "auto" | AIPersona;

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  confidence?: AIConfidence;
  sources?: string[];
}

const personaChoices: Array<{ value: PersonaPicker; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "recruiter", label: "Recruiter" },
  { value: "client", label: "Client" },
  { value: "general", label: "Visitor" }
];

const HINT_SESSION_KEY = "portfolio_ai_floating_hint_seen_v1";
const HINT_DELAY_MS = 7000;
const HINT_VISIBLE_MS = 4200;

function buildMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function FloatingAssistant() {
  const pathname = usePathname();
  const routeContext = useMemo(() => resolveFloatingAssistantContext(pathname), [pathname]);
  const config = useMemo(() => getAIAssistantConfig(routeContext.mode), [routeContext.mode]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [persona, setPersona] = useState<PersonaPicker>("auto");
  const [hintVisible, setHintVisible] = useState(false);

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const hintTimerRef = useRef<number | null>(null);
  const hintHideTimerRef = useRef<number | null>(null);
  const hintHandledRef = useRef(false);

  const promptList = useMemo(() => config.suggestedPrompts.slice(0, 5), [config.suggestedPrompts]);
  const effectivePersona: AIPersona = persona === "auto" ? config.persona : persona;
  const panelTitle =
    routeContext.mode === "project" ? "Ask about this project" : "Ask about my portfolio";

  const markHintSeen = useCallback(() => {
    if (hintHandledRef.current) return;
    hintHandledRef.current = true;
    try {
      window.sessionStorage.setItem(HINT_SESSION_KEY, "1");
    } catch {
    }
  }, []);

  const dismissHint = useCallback(() => {
    if (hintTimerRef.current) {
      window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    if (hintHideTimerRef.current) {
      window.clearTimeout(hintHideTimerRef.current);
      hintHideTimerRef.current = null;
    }
    markHintSeen();
    setHintVisible(false);
  }, [markHintSeen]);

  useEffect(() => {
    let seenThisSession = false;
    try {
      seenThisSession = window.sessionStorage.getItem(HINT_SESSION_KEY) === "1";
    } catch {
      seenThisSession = false;
    }

    hintHandledRef.current = seenThisSession;
    if (seenThisSession) return;

    hintTimerRef.current = window.setTimeout(() => {
      if (hintHandledRef.current || open) return;
      markHintSeen();
      setHintVisible(true);
    }, HINT_DELAY_MS);

    return () => {
      if (hintTimerRef.current) {
        window.clearTimeout(hintTimerRef.current);
        hintTimerRef.current = null;
      }
      if (hintHideTimerRef.current) {
        window.clearTimeout(hintHideTimerRef.current);
        hintHideTimerRef.current = null;
      }
    };
  }, [markHintSeen, open]);

  useEffect(() => {
    if (!hintVisible) return;

    hintHideTimerRef.current = window.setTimeout(() => {
      dismissHint();
    }, HINT_VISIBLE_MS);

    const dismissOnIntent = () => dismissHint();
    window.addEventListener("scroll", dismissOnIntent, { passive: true });
    window.addEventListener("pointerdown", dismissOnIntent, { passive: true });
    window.addEventListener("keydown", dismissOnIntent);

    return () => {
      if (hintHideTimerRef.current) {
        window.clearTimeout(hintHideTimerRef.current);
        hintHideTimerRef.current = null;
      }
      window.removeEventListener("scroll", dismissOnIntent);
      window.removeEventListener("pointerdown", dismissOnIntent);
      window.removeEventListener("keydown", dismissOnIntent);
    };
  }, [dismissHint, hintVisible]);

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open]);

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  async function runQuery(rawQuery: string) {
    const trimmed = rawQuery.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { id: buildMessageId(), role: "user", text: trimmed }]);
    setQuery("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          persona: effectivePersona,
          mode: routeContext.mode,
          projectSlug: routeContext.projectSlug,
          entrySlug: routeContext.entrySlug
        })
      });

      const data = (await response.json()) as AIResponseBody & { message?: string };
      if (!response.ok) throw new Error(data.message || "Unable to answer right now.");

      setMessages((prev) => [
        ...prev,
        {
          id: buildMessageId(),
          role: "assistant",
          text: data.answer,
          confidence: data.confidence,
          sources: data.sources
        }
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Unable to process your question right now."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runQuery(query);
  }

  const showHint = hintVisible && !open;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          const nextOpen = !open;
          if (nextOpen) {
            dismissHint();
          }
          setOpen(nextOpen);
        }}
        aria-expanded={open}
        aria-controls="floating-portfolio-assistant-panel"
        className={cn(
          "fixed bottom-4 right-4 z-[70] inline-flex items-center gap-2 rounded-full border border-accent/40 bg-surface-card px-3.5 py-2.5 text-sm text-text-primary shadow-[0_12px_28px_rgba(0,0,0,0.35)] transition hover:border-accent/70 hover:bg-surface-elevated sm:bottom-6 sm:right-6 sm:px-4",
          showHint ? "ring-1 ring-accent/35" : ""
        )}
      >
        <span
          className={cn(
            "relative inline-flex",
            showHint ? "after:absolute after:-right-1 after:-top-1 after:h-2 after:w-2 after:rounded-full after:bg-accent after:content-[''] motion-safe:after:animate-pulse" : ""
          )}
        >
          <Bot size={16} className="text-accent" />
        </span>
        <span className="hidden sm:inline">Ask Satyajit</span>
      </button>

      <section
        id="floating-portfolio-assistant-panel"
        role="dialog"
        aria-label="Floating portfolio AI assistant"
        className={cn(
          "fixed bottom-20 right-4 z-[70] w-[min(92vw,420px)] rounded-2xl border border-border bg-surface-card shadow-[0_18px_46px_rgba(0,0,0,0.45)] transition-all duration-200 sm:bottom-24 sm:right-6",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
          "motion-reduce:translate-y-0 motion-reduce:transition-none"
        )}
      >
        <header className="border-b border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent">
                <MessageSquareText size={13} />
                {config.badge}
              </p>
              <h2 className="mt-2 font-heading text-lg">{panelTitle}</h2>
              <p className="mt-1 text-xs text-text-secondary">
                {routeContext.routeLabel} context | grounded portfolio answers only
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border p-1.5 text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
              aria-label="Close assistant"
            >
              <X size={14} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {personaChoices.map((choice) => (
              <button
                key={choice.value}
                type="button"
                onClick={() => setPersona(choice.value)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] transition",
                  persona === choice.value
                    ? "border-accent/45 bg-accent-soft text-accent"
                    : "border-border text-text-secondary hover:border-accent/45 hover:text-text-primary"
                )}
              >
                {choice.label}
              </button>
            ))}
          </div>
        </header>

        <div className="space-y-3 p-4">
          <div className="flex flex-wrap gap-2">
            {promptList.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void runQuery(prompt)}
                disabled={loading}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] text-text-secondary transition hover:border-accent/60 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div
            ref={messagesRef}
            className="max-h-[38vh] space-y-2 overflow-y-auto rounded-xl border border-border bg-surface p-3"
          >
            {messages.length === 0 ? (
              <p className="text-sm text-text-secondary">
                {config.emptyState}
              </p>
            ) : (
              messages.map((message) => (
                <article
                  key={message.id}
                  className={cn(
                    "rounded-lg border p-2.5",
                    message.role === "assistant"
                      ? "border-border bg-surface-card"
                      : "border-accent/35 bg-accent-soft"
                  )}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    {message.role === "assistant" ? "Assistant" : "You"}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
                    {message.text}
                  </p>
                  {message.role === "assistant" && message.sources?.length ? (
                    <p className="mt-1 text-[11px] text-text-secondary">
                      Confidence: {message.confidence} | Sources: {message.sources.join(", ")}
                    </p>
                  ) : null}
                </article>
              ))
            )}
          </div>

          {error ? <p className="text-xs text-red-300">{error}</p> : null}

          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <label htmlFor="floating-ai-query" className="sr-only">
              Ask portfolio assistant
            </label>
            <input
              id="floating-ai-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={config.placeholder}
              maxLength={500}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-surface transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Send"
            >
              <Send size={14} />
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setQuery("");
              setError(null);
            }}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!messages.length && !query}
          >
            <RotateCcw size={12} />
            Clear chat
          </button>
        </div>
      </section>
    </>
  );
}
