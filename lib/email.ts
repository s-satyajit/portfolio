import nodemailer from "nodemailer";

interface ContactPayload {
  name: string;
  email: string;
  category: string;
  message: string;
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

export async function sendContactEmail(payload: ContactPayload) {
  const transporter = createTransporter();
  const to = process.env.CONTACT_TO_EMAIL as string;
  const from = process.env.CONTACT_FROM_EMAIL as string;

  await transporter.sendMail({
    from,
    to,
    subject: `[Portfolio Contact] ${payload.category} - ${payload.name}`,
    replyTo: payload.email,
    text: `Name: ${payload.name}
Email: ${payload.email}
Category: ${payload.category}

Message:
${payload.message}
`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;">
        <h2>New Portfolio Contact Submission</h2>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Category:</strong> ${payload.category}</p>
        <p><strong>Message:</strong></p>
        <p>${payload.message.replace(/\n/g, "<br/>")}</p>
      </div>
    `
  });
}
