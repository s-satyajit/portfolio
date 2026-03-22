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
    title: "Context First",
    description: "You share role/project scope, constraints, and timeline."
  },
  {
    title: "Focused Reply",
    description: "I respond with fit, approach, and practical next action."
  },
  {
    title: "Execution Path",
    description: "If aligned, we move to call, scope, or delivery planning."
  }
];

export const contactFaq = [
  {
    question: "What details help you respond faster?",
    answer:
      "Role/project scope, timeline, expected ownership, and stack context are the most useful."
  },
  {
    question: "Do you take freelance projects?",
    answer:
      "Yes. I take focused freelance work where requirements are clear and outcomes are well-defined."
  },
  {
    question: "Are you open to full-time roles?",
    answer:
      "Yes, especially product teams where full-stack execution and applied AI features matter."
  },
  {
    question: "How do you prefer starting collaboration?",
    answer:
      "Async context first through this form, followed by a focused call when there is clear alignment."
  }
];
