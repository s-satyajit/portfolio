import { aiSystemRules } from "@/data/ai-grounding";
import { currentlyBuilding } from "@/data/currently-building";
import { experienceTimeline } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { skillGroups } from "@/data/skills";
import { getAllBlogPosts, getAllCaseStudies, getAllResearchEntries } from "@/lib/mdx";
import { AIConfidence, AIPersona, AIResponseBody } from "@/types/ai";

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

function personaGuidance(persona: AIPersona): string {
  switch (persona) {
    case "recruiter":
      return "Prioritize hiring fit, technical depth, and strongest projects for interview screening.";
    case "client":
      return "Prioritize what Satyajit can build, delivery style, and best service fit.";
    case "collaborator":
      return "Prioritize technical collaboration style, stack overlap, and project workflows.";
    default:
      return "Provide concise, balanced summary for a general visitor.";
  }
}

function inferConfidence(query: string): AIConfidence {
  const lower = query.toLowerCase();
  if (lower.includes("salary") || lower.includes("years of experience")) return "low";
  if (lower.includes("fit") || lower.includes("role") || lower.includes("strongest")) {
    return "medium";
  }
  return "high";
}

function inferSources(query: string): string[] {
  const lower = query.toLowerCase();
  const sources = new Set<string>(["profile"]);
  if (lower.includes("project")) sources.add("projects");
  if (lower.includes("research")) sources.add("research");
  if (lower.includes("blog") || lower.includes("write")) sources.add("blog");
  if (lower.includes("service") || lower.includes("client")) sources.add("services");
  if (lower.includes("experience") || lower.includes("intern")) sources.add("experience");
  if (lower.includes("build")) sources.add("currently-building");
  if (sources.size === 1) sources.add("projects");
  return [...sources];
}

async function buildGroundingContext(): Promise<string> {
  const [blogPosts, researchEntries, caseStudies] = await Promise.all([
    getAllBlogPosts(true),
    getAllResearchEntries(true),
    getAllCaseStudies(true)
  ]);

  const compact = {
    profile: {
      name: profile.name,
      title: profile.title,
      location: profile.location,
      bio: profile.bio,
      availability: profile.availability.note,
      education: profile.education
    },
    skills: skillGroups,
    projects: projects.map((item) => ({
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      category: item.category,
      techStack: item.techStack,
      featured: item.featured,
      links: item.links
    })),
    services: services.map((item) => ({
      title: item.title,
      summary: item.summary,
      deliverables: item.deliverables
    })),
    experience: experienceTimeline.map((item) => ({
      role: item.role,
      company: item.company,
      type: item.type,
      period: `${item.startDate} to ${item.endDate}`,
      highlights: item.highlights
    })),
    currentlyBuilding,
    research: researchEntries.map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      status: entry.status,
      summary: entry.summary,
      date: entry.date
    })),
    blog: blogPosts.map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      excerpt: entry.excerpt,
      tags: entry.tags,
      date: entry.date
    })),
    caseStudies: caseStudies.map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      context: entry.context,
      problem: entry.problem,
      conclusion: entry.conclusion
    }))
  };

  return JSON.stringify(compact);
}

function fallbackAnswer(query: string, persona: AIPersona): AIResponseBody {
  const lower = query.toLowerCase();
  const sources = inferSources(query);

  if (lower.includes("30 seconds") || lower.includes("summarize")) {
    return {
      answer:
        "Satyajit Samal is an AI-focused engineer with full-stack foundations, currently pursuing an M.E. in AI at Chandigarh University. He builds practical products across web applications, dashboards, and AI-integrated experiences, and is open to internships, freelance projects, and full-time roles.",
      confidence: "high",
      sources
    };
  }

  if (lower.includes("strongest tech stack")) {
    return {
      answer:
        "His strongest stack combines React/Next.js on the frontend, Node.js API workflows on the backend, and Python-based AI/ML tooling for intelligent product features.",
      confidence: "high",
      sources
    };
  }

  return {
    answer:
      "The assistant is temporarily running in grounded fallback mode. Based on portfolio data, Satyajit builds AI-integrated and full-stack products with strong emphasis on practical delivery, clean UX, and production-minded implementation.",
    confidence: persona === "general" ? "medium" : "high",
    sources
  };
}

export async function generatePortfolioAnswer(
  query: string,
  persona: AIPersona = "general"
): Promise<AIResponseBody> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!apiKey) {
    return fallbackAnswer(query, persona);
  }

  const groundingContext = await buildGroundingContext();
  const systemPrompt = `${aiSystemRules.join("\n")}\n${personaGuidance(persona)}`;
  const userPrompt = `User query: ${query}

Grounding data (JSON):
${groundingContext}

Return only concise answer text.`;

  try {
    const response = await fetch(
      `${GEMINI_ENDPOINT}/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 360
          }
        })
      }
    );

    if (!response.ok) {
      return fallbackAnswer(query, persona);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const answer =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("\n")
        .trim() || "";

    if (!answer) {
      return fallbackAnswer(query, persona);
    }

    return {
      answer,
      sources: inferSources(query),
      confidence: inferConfidence(query)
    };
  } catch {
    return fallbackAnswer(query, persona);
  }
}
