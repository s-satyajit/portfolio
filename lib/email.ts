import nodemailer from "nodemailer";

import {
  ContactBudget,
  ContactCategory,
  ContactPreferredContact,
  ContactTimeline
} from "@/types/contact";

interface ContactPayload {
  name: string;
  email: string;
  category: ContactCategory;
  message: string;
  organization?: string;
  roleTitle?: string;
  timeline?: ContactTimeline;
  budget?: ContactBudget;
  preferredContact?: ContactPreferredContact;
}

function ensureEmailEnv() {
  const required = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_SECURE",
    "SMTP_USER",
    "SMTP_PASS",
    "CONTACT_TO_EMAIL",
    "CONTACT_FROM_EMAIL"
  ];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
}

function createTransporter() {
  ensureEmailEnv();
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function prettyCategory(category: ContactCategory): string {
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function sendContactEmail(payload: ContactPayload) {
  const transporter = createTransporter();
  const to = process.env.CONTACT_TO_EMAIL as string;
  const from = process.env.CONTACT_FROM_EMAIL as string;

  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Category: ${payload.category}`,
    `Organization: ${payload.organization || "Not provided"}`,
    `Role/Context: ${payload.roleTitle || "Not provided"}`,
    `Timeline: ${payload.timeline || "Not provided"}`,
    `Budget: ${payload.budget || "Not provided"}`,
    `Preferred Contact: ${payload.preferredContact || "Not provided"}`,
    "",
    "Message:",
    payload.message
  ];

  await transporter.sendMail({
    from,
    to,
    subject: `[Portfolio Contact] ${prettyCategory(payload.category)} - ${payload.name}`,
    replyTo: payload.email,
    text: lines.join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.65;color:#172036;">
        <h2 style="margin-bottom:12px;">New Portfolio Contact Submission</h2>
        <table style="border-collapse:collapse;width:100%;max-width:720px;">
          <tbody>
            <tr><td style="padding:6px 0;"><strong>Name:</strong></td><td style="padding:6px 0;">${escapeHtml(payload.name)}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Email:</strong></td><td style="padding:6px 0;">${escapeHtml(payload.email)}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Category:</strong></td><td style="padding:6px 0;">${escapeHtml(prettyCategory(payload.category))}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Organization:</strong></td><td style="padding:6px 0;">${escapeHtml(payload.organization || "Not provided")}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Role / Context:</strong></td><td style="padding:6px 0;">${escapeHtml(payload.roleTitle || "Not provided")}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Timeline:</strong></td><td style="padding:6px 0;">${escapeHtml(payload.timeline || "Not provided")}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Budget:</strong></td><td style="padding:6px 0;">${escapeHtml(payload.budget || "Not provided")}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Preferred Contact:</strong></td><td style="padding:6px 0;">${escapeHtml(payload.preferredContact || "Not provided")}</td></tr>
          </tbody>
        </table>
        <p style="margin:16px 0 8px;"><strong>Message:</strong></p>
        <p style="margin:0;padding:12px;background:#f5f8ff;border-radius:8px;">${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>
      </div>
    `
  });
}
