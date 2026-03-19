import { ExperienceItem } from "@/types/experience";

export const experienceTimeline: ExperienceItem[] = [
  {
    id: "freelance-web",
    role: "Freelance Full-Stack Developer",
    company: "Independent Client Work",
    type: "freelance",
    location: "Remote",
    startDate: "2024-07-01",
    endDate: "Present",
    highlights: [
      "Built and shipped client-focused web interfaces and portfolio products.",
      "Handled end-to-end implementation from UX layout through deployment.",
      "Collaborated directly with stakeholders on iteration and delivery."
    ],
    tech: ["React", "Next.js", "Node.js", "Tailwind CSS"]
  },
  {
    id: "me-ai",
    role: "M.E. Candidate, Artificial Intelligence",
    company: "Chandigarh University",
    type: "education",
    location: "Chandigarh, India",
    startDate: "2024-08-01",
    endDate: "Present",
    highlights: [
      "Focused on applied AI, system-level thinking, and research-backed engineering.",
      "Developing practical AI projects and publication-ready technical writing."
    ],
    tech: ["Python", "PyTorch", "TensorFlow", "Research Methods"]
  },
  {
    id: "btech-cse",
    role: "B.Tech, Computer Science and Engineering",
    company: "Biju Pattanaik University of Technology",
    type: "education",
    location: "Odisha, India",
    startDate: "2020-08-01",
    endDate: "2024-06-01",
    highlights: [
      "Built core full-stack and frontend projects across academic and personal tracks.",
      "Strengthened software engineering fundamentals and system implementation skills."
    ],
    tech: ["C++", "JavaScript", "React", "Node.js"]
  }
];
