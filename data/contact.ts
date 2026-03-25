import {
  ContactBudget,
  ContactCategory,
  ContactPreferredContact,
  ContactTimeline
} from "@/types/contact";

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export const contactCategoryOptions: Array<SelectOption<ContactCategory>> = [
  { value: "job-opportunity", label: "Job opportunity" },
  { value: "freelance-project", label: "Freelance project" },
  { value: "collaboration", label: "Collaboration" },
  { value: "general-message", label: "General message" }
];

export const contactTimelineOptions: Array<SelectOption<ContactTimeline>> = [
  { value: "immediate", label: "Immediate (this week)" },
  { value: "within-2-weeks", label: "Within 2 weeks" },
  { value: "this-month", label: "This month" },
  { value: "next-quarter", label: "Next quarter" },
  { value: "flexible", label: "Flexible timeline" }
];

export const contactBudgetOptions: Array<SelectOption<ContactBudget>> = [
  { value: "not-applicable", label: "Not applicable" },
  { value: "under-500", label: "Under $500" },
  { value: "500-2000", label: "$500 - $2,000" },
  { value: "2000-5000", label: "$2,000 - $5,000" },
  { value: "5000-plus", label: "$5,000+" },
  { value: "to-be-discussed", label: "To be discussed" }
];

export const contactPreferredContactOptions: Array<SelectOption<ContactPreferredContact>> = [
  { value: "email", label: "Email" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "video-call", label: "Video call after initial context" }
];

export const contactMessageTemplates: Record<ContactCategory, string[]> = {
  "job-opportunity": [
    "Role title, team, and expected ownership:",
    "Tech stack and interview process:",
    "Preferred joining timeline:"
  ],
  "freelance-project": [
    "Project objective and core user workflow:",
    "Current stack (if any) and deliverables needed:",
    "Timeline, budget range, and launch expectations:"
  ],
  collaboration: [
    "Collaboration context and goal:",
    "Technical area where collaboration is needed:",
    "Expected timeline and communication style:"
  ],
  "general-message": [
    "Reason for reaching out:",
    "Relevant context:",
    "What outcome you are expecting:"
  ]
};

export const contactResponseCommitments = [
  "Clear response with next steps, not generic replies.",
  "Typical first response within 24-48 hours.",
  "If there is no fit, a concise decline with clarity."
];

export const contactProcessSteps = [
  {
    title: "Share Project Context",
    description:
      "Send your project goal, current stack, expected deliverables, and timeline in the form."
  },
  {
    title: "Fit and Scope Review",
    description:
      "I review feasibility and reply with role fit, implementation direction, and the best next step."
  },
  {
    title: "Discussion and Execution Plan",
    description:
      "If aligned, we move to a focused discussion and lock scope, milestones, and collaboration flow."
  }
];

export const contactFaq = [
  {
    question: "What should I include for a project discussion?",
    answer:
      "Share the project objective, current stack, timeline, expected deliverables, and any existing constraints."
  },
  {
    question: "Can you handle end-to-end product delivery?",
    answer:
      "Yes. I can work across frontend, backend, API integration, and applied AI features depending on scope."
  },
  {
    question: "How do we start if there is a good fit?",
    answer:
      "Start with concise async context through the form. If aligned, we can move to a focused call and execution plan."
  },
  {
    question: "What opportunities are you open to right now?",
    answer:
      "I am open to full-time roles, freelance projects, and meaningful technical collaborations."
  }
];
