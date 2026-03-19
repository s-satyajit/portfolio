export interface SkillGroup {
  title: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "AI & ML",
    items: [
      "Python",
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "Computer Vision",
      "LLM Integration"
    ]
  },
  {
    title: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"]
  },
  {
    title: "Backend & Systems",
    items: [
      "Node.js",
      "Express",
      "REST APIs",
      "Authentication Workflows",
      "Deployment Architecture"
    ]
  },
  {
    title: "Tools",
    items: ["Git", "Docker", "AWS basics", "Vercel", "Postman", "Jupyter"]
  }
];
