"use client";

import { Clock3, Copy, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import { profile } from "@/data/profile";
import { contactFaq, contactProcessSteps, contactResponseCommitments } from "@/data/contact";
import { socialLinks } from "@/data/social-links";

function formatISTTime(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(date);
}

export function ContactSidePanel() {
  const [istTime, setIstTime] = useState(() => formatISTTime(new Date()));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setIstTime(formatISTTime(new Date())), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-surface-card p-5">
        <h2 className="font-heading text-2xl">Direct Channels</h2>
        <div className="mt-4 space-y-3 text-sm text-text-secondary">
          <p className="inline-flex items-center gap-2">
            <Mail size={14} className="text-accent" />
            <span>{profile.email}</span>
          </p>
          <p className="inline-flex items-center gap-2">
            <MapPin size={14} className="text-accent" />
            <span>{profile.location}</span>
          </p>
          <p className="inline-flex items-center gap-2">
            <Clock3 size={14} className="text-accent" />
            <span>Local time (IST): {istTime}</span>
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
          >
            <Copy size={13} />
            {copied ? "Email copied" : "Copy email"}
          </button>

          {socialLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface-card p-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Response Standards</p>
        <ul className="mt-3 space-y-2 text-sm text-text-secondary">
          {contactResponseCommitments.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-surface-card p-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Process</p>
        <div className="mt-3 space-y-3">
          {contactProcessSteps.map((step, index) => (
            <article key={step.title} className="rounded-xl border border-border bg-surface p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-accent">
                Step {index + 1}: {step.title}
              </p>
              <p className="mt-1 text-sm text-text-secondary">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface-card p-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Quick FAQ</p>
        <div className="mt-3 space-y-2">
          {contactFaq.map((item) => (
            <details key={item.question} className="rounded-xl border border-border bg-surface p-3">
              <summary className="cursor-pointer list-none text-sm text-text-primary">{item.question}</summary>
              <p className="mt-2 text-sm text-text-secondary">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
