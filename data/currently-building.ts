import { CurrentBuildItem } from "@/types/experience";

export const currentlyBuilding: CurrentBuildItem[] = [
  {
    id: "portfolio-ai-command",
    title: "Portfolio AI Command Panel",
    description:
      "Grounded recruiter/client assistant that answers with only verified portfolio context.",
    stage: "building",
    tech: ["Next.js", "Gemini API", "TypeScript", "Prompt Grounding"]
  },
  {
    id: "full-stack-game-system",
    title: "Multiplayer Product Experiment",
    description:
      "Exploring game-oriented real-time workflows to sharpen system design and interaction reliability.",
    stage: "researching",
    tech: ["Realtime Architecture", "WebSockets", "React"]
  },
  {
    id: "research-writing-track",
    title: "AI Research Writing Track",
    description:
      "Preparing publication-quality writing around applied AI engineering and implementation tradeoffs.",
    stage: "shipping",
    tech: ["Research", "Technical Writing", "AI Systems"]
  }
];
