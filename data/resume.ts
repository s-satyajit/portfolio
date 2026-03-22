import {
  ResumeEvaluationItem,
  ResumeFocusTrack,
  ResumePrinciple,
  ResumeSignal
} from "@/types/resume";

export const resumePdfPath = "/resume/Satyajit_Samal_Resume.pdf";

export const resumeSectionLinks = [
  { id: "executive-summary", label: "Executive summary" },
  { id: "role-fit", label: "Role fit" },
  { id: "experience-timeline", label: "Experience timeline" },
  { id: "skills-matrix", label: "Skills matrix" },
  { id: "project-evidence", label: "Project evidence" },
  { id: "writing-and-research", label: "Writing and research" },
  { id: "currently-building", label: "Currently building" },
  { id: "work-principles", label: "Work principles" },
  { id: "resume-ai", label: "Resume AI" },
  { id: "resume-pdf", label: "PDF preview" }
];

export const resumeSignals: ResumeSignal[] = [
  { label: "Positioning", value: "AI Engineer + Full-Stack Developer" },
  { label: "Location", value: "Chandigarh, India" },
  { label: "Availability", value: "Open to full-time and freelance opportunities" },
  { label: "Execution Style", value: "Product-focused, end-to-end implementation" }
];

export const resumeSummaryHighlights = [
  "Building practical AI-powered products with strong full-stack execution.",
  "Comfortable delivering across frontend, backend APIs, auth workflows, and deployment.",
  "Focused on grounded AI behavior and production-ready product thinking."
];

export const resumeFocusTracks: ResumeFocusTrack[] = [
  {
    title: "Applied AI product patterns",
    detail:
      "Designing assistants and AI-enabled workflows that improve real tasks while staying grounded and reliable."
  },
  {
    title: "Full-stack system reliability",
    detail:
      "Strengthening API contracts, role boundaries, and state flow so features remain maintainable as products scale."
  },
  {
    title: "Technical communication",
    detail:
      "Converting implementation decisions into clear writing through blogs, case studies, and research-linked notes."
  }
];

export const resumeWorkPrinciples: ResumePrinciple[] = [
  {
    title: "Build for real usage",
    detail: "I prefer shipping practical workflows over tutorial-style clones."
  },
  {
    title: "Think from UI to system",
    detail: "I treat frontend clarity and backend boundaries as one product problem."
  },
  {
    title: "Use AI with intent",
    detail: "I focus on grounded AI features that are useful, not just impressive."
  },
  {
    title: "Communicate tradeoffs",
    detail: "I value clear reasoning, concise writing, and iterative execution."
  }
];

export const resumeEvaluationChecklist: ResumeEvaluationItem[] = [
  {
    title: "Can he ship end-to-end product features?",
    detail:
      "Yes. Projects cover frontend interfaces, backend APIs, auth workflows, and deployment outcomes."
  },
  {
    title: "Does he show AI implementation depth?",
    detail:
      "Yes. Current work includes grounded assistant integration and trust-focused AI behavior design."
  },
  {
    title: "Is he recruiter-friendly to evaluate quickly?",
    detail:
      "Yes. Work is structured with project summaries, case studies, research links, and role-fit clarity."
  }
];

export const resumeAiPrompts = [
  "Summarize this resume for a recruiter in 30 seconds.",
  "What roles is he best suited for right now?",
  "Which projects should I review first for hiring decisions?",
  "How strong is his full-stack foundation?",
  "What shows his AI direction is practical?"
];
