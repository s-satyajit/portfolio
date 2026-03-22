import { aiSystemRules } from "@/data/ai-grounding";
import { getAllCaseStudies, getAllResearchEntries, getCaseStudyBySlug, getResearchBySlug } from "@/lib/mdx";

type InsightAIKind = "hub" | "research" | "case-study";
type InsightAIMode = "summary" | "key-points" | "simplify" | "next-read" | "ask";

interface GenerateInsightsAIInput {
  kind: InsightAIKind;
  mode: InsightAIMode;
  slug?: string;
  question?: string;
}

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

function compactText(source: string, maxChars = 14000): string {
  if (source.length <= maxChars) return source;
  return `${source.slice(0, maxChars)}\n\n[Truncated for token safety]`;
}

function modeInstruction(mode: InsightAIMode, question?: string): string {
  if (mode === "summary") return "Provide a concise summary in 5-7 bullet points.";
  if (mode === "key-points") return "Extract high-signal key points as numbered insights.";
  if (mode === "simplify") return "Explain this in simple language for an early-career engineer.";
  if (mode === "next-read") return "Recommend what to read next from the given context and explain why.";
  return `Answer this question only from provided context: ${question || ""}`;
}

function fallbackForHub(mode: InsightAIMode, question?: string): string {
  if (mode === "summary") {
    return "Insights hub includes research drafts and case studies that show practical AI direction and system-level reasoning.";
  }
  if (mode === "key-points") {
    return "1. Research entries show AI reliability and evaluation direction.\n2. Case studies show implementation tradeoffs.\n3. Together they show both analytical and shipping capability.";
  }
  if (mode === "simplify") {
    return "This section combines two things: research thinking and practical build decisions.";
  }
  if (mode === "next-read") {
    return "Start with one research note for AI direction, then one case study for system implementation depth.";
  }
  return `I can answer this once Gemini is configured. Current question: ${question || "No question provided."}`;
}

function fallbackForResearch(input: {
  title: string;
  summary: string;
  contribution: string;
  question?: string;
  mode: InsightAIMode;
}): string {
  if (input.mode === "summary") return `${input.title}: ${input.summary}`;
  if (input.mode === "key-points") return `1. ${input.summary}\n2. Contribution: ${input.contribution}`;
  if (input.mode === "simplify") return `In simple terms, ${input.summary.toLowerCase()}`;
  if (input.mode === "next-read") {
    return "After this research entry, read a related case study to see how ideas transfer into product architecture decisions.";
  }
  return `I don't see that information here. Current question: ${input.question || "No question provided."}`;
}

function fallbackForCaseStudy(input: {
  title: string;
  context: string;
  problem: string;
  conclusion: string;
  question?: string;
  mode: InsightAIMode;
}): string {
  if (input.mode === "summary") return `${input.title}: ${input.context}`;
  if (input.mode === "key-points") return `Problem: ${input.problem}\nConclusion: ${input.conclusion}`;
  if (input.mode === "simplify") return `This case study explains a practical system decision and why it worked.`;
  if (input.mode === "next-read") {
    return "After this case study, read a related research entry to connect implementation choices with broader AI/product reasoning.";
  }
  return `I don't see that information here. Current question: ${input.question || "No question provided."}`;
}

async function buildHubContext() {
  const [researchEntries, caseStudies] = await Promise.all([
    getAllResearchEntries(true),
    getAllCaseStudies(true)
  ]);

  return {
    research: researchEntries.slice(0, 8).map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      status: entry.status,
      summary: entry.summary,
      tags: entry.tags
    })),
    caseStudies: caseStudies.slice(0, 8).map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      context: entry.context,
      conclusion: entry.conclusion,
      tags: entry.tags
    }))
  };
}

export async function generateInsightsAI(input: GenerateInsightsAIInput): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (input.kind === "hub") {
    const context = await buildHubContext();

    if (!apiKey) return fallbackForHub(input.mode, input.question);

    const prompt = `You are an insights assistant for Satyajit Samal's portfolio.
Rules:
- Use only provided context.
- Do not invent achievements or unavailable details.
- If data is missing, say: I don't see that information here.
- Keep output concise and practical.

Mode: ${input.mode}
Task: ${modeInstruction(input.mode, input.question)}

Context JSON:
${JSON.stringify(context)}`;

    try {
      const response = await fetch(`${GEMINI_ENDPOINT}/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: [...aiSystemRules, "Focus on research and case-study navigation."].join("\n") }]
          },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 520
          }
        })
      });

      if (!response.ok) return fallbackForHub(input.mode, input.question);
      const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();
      return text || fallbackForHub(input.mode, input.question);
    } catch {
      return fallbackForHub(input.mode, input.question);
    }
  }

  if (input.kind === "research") {
    if (!input.slug) throw new Error("Research slug is required.");
    const entry = await getResearchBySlug(input.slug);
    if (!entry) throw new Error("Research entry not found.");

    if (!apiKey) {
      return fallbackForResearch({
        title: entry.title,
        summary: entry.summary,
        contribution: entry.contribution,
        question: input.question,
        mode: input.mode
      });
    }

    const prompt = `You are a research-reading assistant.
Rules:
- Use only the entry context.
- Do not invent information.
- If unavailable, respond: I don't see that information here.
- Keep answer concise and useful for recruiters and technical readers.

Mode: ${input.mode}
Task: ${modeInstruction(input.mode, input.question)}

Entry metadata:
${JSON.stringify({
  slug: entry.slug,
  title: entry.title,
  status: entry.status,
  summary: entry.summary,
  abstract: entry.abstract,
  contribution: entry.contribution,
  venue: entry.venue,
  date: entry.date,
  tags: entry.tags
})}

Entry content:
${compactText(entry.content)}`;

    try {
      const response = await fetch(`${GEMINI_ENDPOINT}/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: [...aiSystemRules, "Context mode is research entry."].join("\n") }]
          },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 520
          }
        })
      });

      if (!response.ok) {
        return fallbackForResearch({
          title: entry.title,
          summary: entry.summary,
          contribution: entry.contribution,
          question: input.question,
          mode: input.mode
        });
      }
      const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();
      if (!text) {
        return fallbackForResearch({
          title: entry.title,
          summary: entry.summary,
          contribution: entry.contribution,
          question: input.question,
          mode: input.mode
        });
      }
      return text;
    } catch {
      return fallbackForResearch({
        title: entry.title,
        summary: entry.summary,
        contribution: entry.contribution,
        question: input.question,
        mode: input.mode
      });
    }
  }

  if (!input.slug) throw new Error("Case-study slug is required.");
  const entry = await getCaseStudyBySlug(input.slug);
  if (!entry) throw new Error("Case study entry not found.");

  if (!apiKey) {
    return fallbackForCaseStudy({
      title: entry.title,
      context: entry.context,
      problem: entry.problem,
      conclusion: entry.conclusion,
      question: input.question,
      mode: input.mode
    });
  }

  const prompt = `You are a case-study reading assistant.
Rules:
- Use only the entry context.
- Do not invent details.
- If unavailable, respond: I don't see that information here.
- Keep answer concise, practical, and recruiter-friendly.

Mode: ${input.mode}
Task: ${modeInstruction(input.mode, input.question)}

Entry metadata:
${JSON.stringify({
  slug: entry.slug,
  title: entry.title,
  context: entry.context,
  problem: entry.problem,
  analysis: entry.analysis,
  conclusion: entry.conclusion,
  keyInsights: entry.keyInsights,
  learnings: entry.learnings,
  date: entry.date,
  tags: entry.tags
})}

Entry content:
${compactText(entry.content)}`;

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: [...aiSystemRules, "Context mode is case-study entry."].join("\n") }]
        },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 520
        }
      })
    });

    if (!response.ok) {
      return fallbackForCaseStudy({
        title: entry.title,
        context: entry.context,
        problem: entry.problem,
        conclusion: entry.conclusion,
        question: input.question,
        mode: input.mode
      });
    }
    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();
    if (!text) {
      return fallbackForCaseStudy({
        title: entry.title,
        context: entry.context,
        problem: entry.problem,
        conclusion: entry.conclusion,
        question: input.question,
        mode: input.mode
      });
    }
    return text;
  } catch {
    return fallbackForCaseStudy({
      title: entry.title,
      context: entry.context,
      problem: entry.problem,
      conclusion: entry.conclusion,
      question: input.question,
      mode: input.mode
    });
  }
}
