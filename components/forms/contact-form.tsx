"use client";

import { FormEvent, useState } from "react";

const categories = [
  { value: "job-opportunity", label: "Job opportunity" },
  { value: "freelance-project", label: "Freelance project" },
  { value: "collaboration", label: "Collaboration" },
  { value: "general-message", label: "General message" }
] as const;

type Category = (typeof categories)[number]["value"];

interface FormState {
  name: string;
  email: string;
  category: Category;
  message: string;
  company: string;
  website: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  category: "general-message",
  message: "",
  company: "",
  website: ""
};

export function ContactForm() {
  const [state, setState] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

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
      setState(initialState);
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

      <label className="space-y-2 text-sm">
        <span className="text-text-secondary">Category</span>
        <select
          required
          value={state.category}
          onChange={(event) =>
            setState((prev) => ({ ...prev, category: event.target.value as Category }))
          }
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
        >
          {categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm">
        <span className="text-text-secondary">Message</span>
        <textarea
          required
          minLength={20}
          maxLength={2000}
          rows={6}
          value={state.message}
          onChange={(event) => setState((prev) => ({ ...prev, message: event.target.value }))}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary"
        />
      </label>

      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={state.company}
        onChange={(event) => setState((prev) => ({ ...prev, company: event.target.value }))}
      />
      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={state.website}
        onChange={(event) => setState((prev) => ({ ...prev, website: event.target.value }))}
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {status ? (
        <p className={`text-sm ${status.type === "success" ? "text-cyan-200" : "text-red-300"}`}>
          {status.text}
        </p>
      ) : null}
    </form>
  );
}
