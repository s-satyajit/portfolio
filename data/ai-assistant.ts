import { AIContextMode, AIPersona } from "@/types/ai";

interface AIAssistantConfig {
  badge: string;
  heading: string;
  helperText: string;
  placeholder: string;
  submitLabel: string;
  emptyState: string;
  persona: AIPersona;
  suggestedPrompts: string[];
}

interface AssistantConfigOptions {
  projectTitle?: string;
}

const homepagePrompts = [
  "Give me a quick overview of Satyajit.",
  "Which project should I review first?",
  "What stack is he strongest in?",
  "What is he building right now?",
  "Can he work across frontend and backend?"
];

const recruiterPrompts = [
  "What roles is he best suited for?",
  "What are his strongest projects?",
  "Has he worked on AI features?",
  "What is his current focus?",
  "Is he stronger in frontend or backend?",
  "Which project should I review first?",
  "What makes him worth interviewing?"
];

const aboutPrompts = [
  "Why is Satyajit moving toward AI?",
  "What is he focused on right now?",
  "What kind of roles is he aiming for?",
  "Is he more full-stack or AI-focused?",
  "What projects best reflect his strengths?",
  "What makes him different from other freshers?"
];

const contactPrompts = [
  "What details should I include for a freelance request?",
  "Which projects should recruiters review first?",
  "Is he open to full-time and freelance opportunities?",
  "What services are the best fit for dashboard development?",
  "What is his strongest stack for product builds?"
];

const resumePrompts = [
  "Summarize this resume for a recruiter in 30 seconds.",
  "What roles is he best suited for right now?",
  "Which projects should I review first for hiring decisions?",
  "How strong is his full-stack foundation?",
  "What shows his AI direction is practical?"
];

const blogPrompts = [
  "What is the main idea of this article?",
  "Why does this article matter for recruiters?",
  "How does this connect to his projects?",
  "Can you simplify the technical parts?",
  "What should I read next after this?"
];

const researchPrompts = [
  "Summarize this research entry quickly.",
  "What is the main contribution here?",
  "Why does this matter for applied AI work?",
  "What should recruiters notice first?",
  "What is a practical implementation takeaway?"
];

const caseStudyPrompts = [
  "What problem is analyzed in this case study?",
  "What key decision mattered most?",
  "What does this show about engineering thinking?",
  "How is this relevant for recruiters?",
  "What would be improved next?"
];

const insightsPrompts = [
  "Which insight should recruiters read first?",
  "Which case study best shows system thinking?",
  "Which research note is most practical?",
  "How do these insights connect to projects?",
  "What should a client read first?"
];

const servicesPrompts = [
  "What kind of products can he build for a client?",
  "Can he handle end-to-end full-stack delivery?",
  "Can he integrate AI features safely?",
  "Which service is best for dashboard work?",
  "What should I include before contacting him?"
];

const experiencePrompts = [
  "What is he currently focused on?",
  "How does his background support full-stack roles?",
  "How does his AI direction connect to experience?",
  "What can he likely contribute early in a team?",
  "What should recruiters evaluate first?"
];

export function getAIAssistantConfig(
  mode: AIContextMode,
  options: AssistantConfigOptions = {}
): AIAssistantConfig {
  if (mode === "recruiter") {
    return {
      badge: "Recruiter AI",
      heading: "Ask about Satyajit",
      helperText:
        "Ask recruiter-focused questions about role fit, technical strengths, projects, and current direction.",
      placeholder: "Ask a recruiter question...",
      submitLabel: "Ask",
      emptyState:
        "Start with a suggested question, or ask directly about role fit, strongest projects, or technical depth.",
      persona: "recruiter",
      suggestedPrompts: recruiterPrompts
    };
  }

  if (mode === "project") {
    const title = options.projectTitle ? `"${options.projectTitle}"` : "this project";
    return {
      badge: "Project AI",
      heading: "Ask about this project",
      helperText:
        "Answers are grounded to this project details, with minimal profile context for recruiter relevance.",
      placeholder: `Ask about ${title}...`,
      submitLabel: "Ask",
      emptyState:
        "Ask what problem this project solves, what was personally built, and why it matters for hiring evaluation.",
      persona: "recruiter",
      suggestedPrompts: [
        "What problem does this project solve?",
        "What did Satyajit personally build here?",
        "What technologies are used?",
        "What is technically interesting in this project?",
        "What would he improve next?",
        "Why does this project matter for recruiters?"
      ]
    };
  }

  if (mode === "about") {
    return {
      badge: "About AI",
      heading: "Ask about background and direction",
      helperText:
        "Quick Q&A about education path, current focus, and the kind of engineering work he is moving toward.",
      placeholder: "Ask about background, goals, or focus...",
      submitLabel: "Ask",
      emptyState:
        "Ask about education, current learning track, why AI is a focus area, or preferred team/problem types.",
      persona: "general",
      suggestedPrompts: aboutPrompts
    };
  }

  if (mode === "contact") {
    return {
      badge: "Contact AI",
      heading: "Ask before you reach out",
      helperText:
        "Use this to frame a better outreach message with role/project context and relevant portfolio references.",
      placeholder: "Ask how to frame your outreach...",
      submitLabel: "Ask",
      emptyState:
        "Ask what details to include, which proof links to review, or how to route your inquiry.",
      persona: "client",
      suggestedPrompts: contactPrompts
    };
  }

  if (mode === "resume") {
    return {
      badge: "Resume AI",
      heading: "Ask resume-focused questions",
      helperText:
        "Use this for recruiter-style resume screening, role fit checks, and project-priority guidance.",
      placeholder: "Ask about resume fit, strengths, and proof...",
      submitLabel: "Ask",
      emptyState:
        "Ask for a 30-second summary, role fit, strongest proof projects, or technical depth signals.",
      persona: "recruiter",
      suggestedPrompts: resumePrompts
    };
  }

  if (mode === "blog") {
    return {
      badge: "Blog AI",
      heading: "Ask about this article",
      helperText:
        "Use this assistant for concise article understanding and recruiter/client relevance checks.",
      placeholder: "Ask about this article...",
      submitLabel: "Ask",
      emptyState:
        "Ask for a summary, practical takeaways, or how this article connects to projects and role fit.",
      persona: "general",
      suggestedPrompts: blogPrompts
    };
  }

  if (mode === "research") {
    return {
      badge: "Research AI",
      heading: "Ask about this research entry",
      helperText:
        "Grounded Q&A for contribution, practical relevance, and implementation-level interpretation.",
      placeholder: "Ask about this research entry...",
      submitLabel: "Ask",
      emptyState:
        "Ask for summary, contribution, practical relevance, or recruiter-facing interpretation.",
      persona: "recruiter",
      suggestedPrompts: researchPrompts
    };
  }

  if (mode === "case-study") {
    return {
      badge: "Case Study AI",
      heading: "Ask about this case study",
      helperText:
        "Use this for fast decision-analysis summaries and practical engineering takeaways.",
      placeholder: "Ask about this case study...",
      submitLabel: "Ask",
      emptyState:
        "Ask about problem framing, options considered, conclusion quality, and what was learned.",
      persona: "recruiter",
      suggestedPrompts: caseStudyPrompts
    };
  }

  if (mode === "insights") {
    return {
      badge: "Insights AI",
      heading: "Ask across research and case studies",
      helperText:
        "Navigate insight quality quickly for recruiter evaluation, technical depth checks, and client reading paths.",
      placeholder: "Ask across insights...",
      submitLabel: "Ask",
      emptyState:
        "Ask which entry to read first based on hiring, technical depth, or client-focused goals.",
      persona: "recruiter",
      suggestedPrompts: insightsPrompts
    };
  }

  if (mode === "services") {
    return {
      badge: "Services AI",
      heading: "Ask what can be built",
      helperText:
        "Client-focused assistant for scope-fit checks, service selection, and delivery expectations.",
      placeholder: "Ask about services and delivery...",
      submitLabel: "Ask",
      emptyState:
        "Ask what can be built, expected collaboration style, and how to start a scoped discussion.",
      persona: "client",
      suggestedPrompts: servicesPrompts
    };
  }

  if (mode === "experience") {
    return {
      badge: "Experience AI",
      heading: "Ask about experience and direction",
      helperText:
        "Use this to evaluate execution maturity, current focus, and likely near-term role contribution.",
      placeholder: "Ask about experience, focus, and role-fit...",
      submitLabel: "Ask",
      emptyState:
        "Ask what he is focused on now, what he can contribute early, and how experience connects to projects.",
      persona: "recruiter",
      suggestedPrompts: experiencePrompts
    };
  }

  return {
    badge: "Portfolio AI",
    heading: "Quick portfolio Q&A",
    helperText:
      "Concise answers grounded to portfolio content. Useful for recruiter, collaborator, and client screening.",
    placeholder: "Ask about projects, stack, role fit, or current focus...",
    submitLabel: "Ask",
    emptyState:
      "Try a suggested prompt for a quick start. The assistant only answers from available portfolio context.",
    persona: "general",
    suggestedPrompts: homepagePrompts
  };
}
