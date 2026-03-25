"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  contactBudgetOptions,
  contactCategoryOptions,
  contactMessageTemplates,
  contactPreferredContactOptions,
  contactTimelineOptions
} from "@/data/contact";
import {
  ContactBudget,
  ContactCategory,
  ContactPreferredContact,
  ContactTimeline
} from "@/types/contact";

const MESSAGE_MIN = 30;
const MESSAGE_MAX = 2000;
const STORAGE_KEY = "contact-form-draft-v2";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  name: string;
  email: string;
  category: ContactCategory;
  message: string;
  organization: string;
  roleTitle: string;
  timeline: ContactTimeline;
  budget: ContactBudget;
  preferredContact: ContactPreferredContact;
  consent: boolean;
  startedAt: number;
  website: string;
  fax: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  category: "general-message",
  message: "",
  organization: "",
  roleTitle: "",
  timeline: "flexible",
  budget: "not-applicable",
  preferredContact: "email",
  consent: false,
  startedAt: Date.now(),
  website: "",
  fax: ""
};

function buildMessageDraft(state: FormState): string {
  const greeting = "Hi Satyajit,";
  const introByCategory: Record<ContactCategory, string> = {
    "job-opportunity":
      "I am reaching out regarding a full-time opportunity and would like to discuss role fit.",
    "freelance-project":
      "I am reaching out with a freelance project and would like to discuss scope and execution.",
    collaboration:
      "I am reaching out for a technical collaboration and would like to explore a practical working plan.",
    "general-message": "I am reaching out to discuss a relevant opportunity and next steps."
  };

  const details: string[] = [];
  if (state.organization.trim()) {
    details.push(`Organization: ${state.organization.trim()}`);
  }
  if (state.roleTitle.trim()) {
    details.push(`Role/Context: ${state.roleTitle.trim()}`);
  }
  if (state.timeline) {
    details.push(`Timeline: ${state.timeline}`);
  }
  if (state.budget && state.budget !== "not-applicable") {
    details.push(`Budget context: ${state.budget}`);
  }
  if (state.preferredContact) {
    details.push(`Preferred contact: ${state.preferredContact}`);
  }
  if (details.length === 0) {
    details.push("Primary project context and constraints can be shared in a follow-up reply.");
  }

  const lines = [
    greeting,
    "",
    introByCategory[state.category],
    "",
    "Here is the context:",
    ...details.map((line) => `- ${line}`),
    "",
    "Please let me know if this aligns with your current availability and how you would like to proceed.",
    "",
    "Best regards,",
    state.name.trim()
  ];

  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

export function ContactForm() {
  const [state, setState] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [aiDrafting, setAiDrafting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  const remaining = MESSAGE_MAX - state.message.length;
  const validMessageLength = state.message.trim().length >= MESSAGE_MIN;
  const canSubmit =
    !loading && state.consent && validMessageLength && Boolean(state.name.trim()) && Boolean(state.email.trim());
  const canUseAiWriter =
    !loading &&
    !aiDrafting &&
    Boolean(state.name.trim()) &&
    EMAIL_REGEX.test(state.email.trim()) &&
    Boolean(state.category);

  const activeTemplates = useMemo(
    () => contactMessageTemplates[state.category] || [],
    [state.category]
  );

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<FormState>;
      setState((prev) => ({
        ...prev,
        ...parsed,
        startedAt:
          typeof parsed.startedAt === "number" && Number.isFinite(parsed.startedAt)
            ? parsed.startedAt
            : Date.now(),
        website: "",
        fax: ""
      }));
      setDraftRestored(true);
    } catch {
      setDraftRestored(false);
    }
  }, []);

  useEffect(() => {
    const draft: Partial<FormState> = {
      name: state.name,
      email: state.email,
      category: state.category,
      message: state.message,
      organization: state.organization,
      roleTitle: state.roleTitle,
      timeline: state.timeline,
      budget: state.budget,
      preferredContact: state.preferredContact,
      consent: state.consent,
      startedAt: state.startedAt
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [
    state.budget,
    state.category,
    state.consent,
    state.email,
    state.message,
    state.name,
    state.organization,
    state.preferredContact,
    state.roleTitle,
    state.startedAt,
    state.timeline
  ]);

  function applyTemplate(line: string) {
    setState((prev) => {
      const prefix = prev.message.trim().length > 0 ? "\n" : "";
      return {
        ...prev,
        message: `${prev.message}${prefix}${line}\n`
      };
    });
  }

  function clearDraftAndReset() {
    window.localStorage.removeItem(STORAGE_KEY);
    setState({
      ...initialState,
      startedAt: Date.now()
    });
    setDraftRestored(false);
    setStatus(null);
  }

  function writeWithAI() {
    if (!canUseAiWriter) {
      setStatus({
        type: "error",
        text: "Fill name, email, and category first, then use Write with AI."
      });
      return;
    }

    setAiDrafting(true);
    setStatus(null);
    setState((prev) => ({
      ...prev,
      message: buildMessageDraft(prev)
    }));
    setAiDrafting(false);
    setStatus({
      type: "success",
      text: "Draft added. Review and edit the message before sending."
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state)
      });
      const data = (await response.json()) as { ok: boolean; message: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Submission failed");
      }

      setStatus({ type: "success", text: data.message });
      window.localStorage.removeItem(STORAGE_KEY);
      setState({
        ...initialState,
        startedAt: Date.now()
      });
      setDraftRestored(false);
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-surface-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-heading text-2xl">Project / Role Intake</p>
          <p className="mt-1 text-sm text-text-secondary">
            Share enough context for a focused and useful response.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {draftRestored ? (
            <span className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs text-accent">
              Draft restored
            </span>
          ) : null}
          <button
            type="button"
            onClick={clearDraftAndReset}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-text-secondary">Name</span>
          <input
            required
            value={state.name}
            onChange={(event) => setState((prev) => ({ ...prev, name: event.target.value }))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="text-text-secondary">Email</span>
          <input
            required
            type="email"
            value={state.email}
            onChange={(event) => setState((prev) => ({ ...prev, email: event.target.value }))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-text-secondary">Organization (optional)</span>
          <input
            value={state.organization}
            onChange={(event) => setState((prev) => ({ ...prev, organization: event.target.value }))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="text-text-secondary">Role / Context (optional)</span>
          <input
            value={state.roleTitle}
            onChange={(event) => setState((prev) => ({ ...prev, roleTitle: event.target.value }))}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-text-secondary">Category</span>
          <select
            required
            value={state.category}
            onChange={(event) =>
              setState((prev) => ({ ...prev, category: event.target.value as ContactCategory }))
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          >
            {contactCategoryOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="text-text-secondary">Preferred Contact</span>
          <select
            value={state.preferredContact}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                preferredContact: event.target.value as ContactPreferredContact
              }))
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          >
            {contactPreferredContactOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-text-secondary">Timeline</span>
          <select
            value={state.timeline}
            onChange={(event) =>
              setState((prev) => ({ ...prev, timeline: event.target.value as ContactTimeline }))
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          >
            {contactTimelineOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="text-text-secondary">Budget / Scope</span>
          <select
            value={state.budget}
            onChange={(event) =>
              setState((prev) => ({ ...prev, budget: event.target.value as ContactBudget }))
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
          >
            {contactBudgetOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-text-secondary">Context starters</p>
        <div className="flex flex-wrap gap-2">
          {activeTemplates.map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => applyTemplate(template)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
            >
              + {template}
            </button>
          ))}
        </div>
      </div>

      <label className="space-y-2 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-text-secondary">Message</span>
          <button
            type="button"
            disabled={!canUseAiWriter}
            onClick={writeWithAI}
            className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {aiDrafting ? "Writing..." : "Write with AI"}
          </button>
        </div>
        <textarea
          required
          minLength={MESSAGE_MIN}
          maxLength={MESSAGE_MAX}
          rows={8}
          value={state.message}
          onChange={(event) => setState((prev) => ({ ...prev, message: event.target.value }))}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
        />
        {!canUseAiWriter ? (
          <p className="text-xs text-text-secondary">
            Fill name, email, and category first to enable AI-assisted drafting.
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={`text-xs ${validMessageLength ? "text-text-secondary" : "text-amber-200"}`}>
            {validMessageLength
              ? "Good context length."
              : `Add at least ${MESSAGE_MIN} characters for better response quality.`}
          </p>
          <p className="text-xs text-text-secondary">{remaining} characters left</p>
        </div>
      </label>

      <label className="flex items-start gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={state.consent}
          onChange={(event) => setState((prev) => ({ ...prev, consent: event.target.checked }))}
          className="mt-1"
          required
        />
        <span>
          I confirm the information is accurate and I am okay with being contacted about this
          message.
        </span>
      </label>

      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={state.website}
        onChange={(event) => setState((prev) => ({ ...prev, website: event.target.value }))}
      />
      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={state.fax}
        onChange={(event) => setState((prev) => ({ ...prev, fax: event.target.value }))}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            setStatus({ type: "success", text: "Draft saved on this browser." });
          }}
          className="rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
        >
          Save Draft
        </button>
      </div>

      <div aria-live="polite">
        {status ? (
          <p className={`text-sm ${status.type === "success" ? "text-cyan-200" : "text-red-300"}`}>
            {status.text}
          </p>
        ) : null}
      </div>
    </form>
  );
}
