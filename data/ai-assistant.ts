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
  "What is his background?",
  "Why is he moving toward AI?",
  "What is he learning right now?",
  "What kind of work is he targeting?"
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
