import { aiSystemRules } from "@/data/ai-grounding";
import { currentlyBuilding } from "@/data/currently-building";
import { experienceTimeline } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import {
  recruiterFaq,
  recruiterLikelyContributions,
  recruiterProductExposure,
  recruiterProofItems,
  recruiterQuickFacts,
  recruiterRoleFit,
  recruiterStrongestAreas
} from "@/data/recruiter-brief";
import { services } from "@/data/services";
import { skillGroups } from "@/data/skills";
import { getAllBlogPosts, getAllCaseStudies, getAllResearchEntries } from "@/lib/mdx";
import { AIConfidence, AIContextMode, AIQueryOptions, AIPersona, AIResponseBody } from "@/types/ai";

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

interface GroundingBundle {
  mode: AIContextMode;
  sources: string[];
  context: Record<string, unknown>;
  projectSlug?: string;
}

function resolveMode(mode?: AIContextMode): AIContextMode {
  return mode || "homepage";
}

function personaGuidance(persona: AIPersona): string {
  switch (persona) {
    case "recruiter":
      return "Prioritize hiring fit, strongest technical areas, concrete project proof, and interview relevance.";
    case "client":
      return "Prioritize delivery capability, implementation clarity, and what can be built end-to-end.";
    case "collaborator":
      return "Prioritize technical collaboration style, stack overlap, and implementation workflow.";
    default:
      return "Answer as a concise, factual portfolio guide for a general visitor.";
  }
}

function modeGuidance(mode: AIContextMode): string {
  switch (mode) {
    case "recruiter":
      return "Mode context is recruiter evaluation. Keep answers direct and evidence-based.";
    case "project":
      return "Mode context is a single project page. Stay focused on that project unless user asks for explicit cross-project comparison.";
    case "about":
      return "Mode context is personal background and direction. Keep tone human and grounded.";
    default:
      return "Mode context is homepage overview. Give concise high-signal summaries.";
  }
}

function inferConfidence(query: string): AIConfidence {
  const lower = query.toLowerCase();
  if (
    lower.includes("salary") ||
    lower.includes("ctc") ||
    lower.includes("gpa") ||
    lower.includes("cgpa") ||
    lower.includes("years of experience")
  ) {
    return "low";
  }

  if (
    lower.includes("best") ||
    lower.includes("fit") ||
    lower.includes("recommend") ||
    lower.includes("stronger")
  ) {
    return "medium";
  }

  return "high";
}

function sourcesByMode(mode: AIContextMode, projectSlug?: string): string[] {
  if (mode === "project") {
    return ["project", "profile", ...(projectSlug ? [`project:${projectSlug}`] : [])];
  }

  if (mode === "about") {
    return ["profile", "experience", "skills", "currently-building"];
  }

  if (mode === "recruiter") {
    return ["profile", "projects", "skills", "experience", "recruiter-brief"];
  }

  return ["profile", "projects", "skills", "experience", "currently-building"];
}

async function loadContentSignals() {
  try {
    const [blogPosts, researchEntries, caseStudies] = await Promise.all([
      getAllBlogPosts(true),
      getAllResearchEntries(true),
      getAllCaseStudies(true)
    ]);

    return {
      blog: blogPosts.slice(0, 4).map((entry) => ({
        slug: entry.slug,
        title: entry.title,
        excerpt: entry.excerpt,
        tags: entry.tags,
        date: entry.date
      })),
      research: researchEntries.slice(0, 4).map((entry) => ({
        slug: entry.slug,
        title: entry.title,
        status: entry.status,
        summary: entry.summary
      })),
      caseStudies: caseStudies.slice(0, 4).map((entry) => ({
        slug: entry.slug,
        title: entry.title,
        problem: entry.problem,
        conclusion: entry.conclusion
      }))
    };
  } catch {
    return {
      blog: [] as Array<Record<string, unknown>>,
      research: [] as Array<Record<string, unknown>>,
      caseStudies: [] as Array<Record<string, unknown>>
    };
  }
}

async function buildGroundingBundle(mode: AIContextMode, projectSlug?: string): Promise<GroundingBundle> {
  const sources = sourcesByMode(mode, projectSlug);

  const sharedProfile = {
    name: profile.name,
    title: profile.title,
    location: profile.location,
    bio: profile.bio,
    longBio: profile.longBio,
    education: profile.education,
    availability: profile.availability,
    interests: profile.interests,
    currentlyFocusing: profile.currentlyFocusing
  };

  if (mode === "project") {
    const project = projects.find((item) => item.slug === projectSlug);

    return {
      mode,
      sources,
      projectSlug,
      context: {
        profile: {
          name: sharedProfile.name,
          title: sharedProfile.title,
          location: sharedProfile.location
        },
        project: project
          ? {
              slug: project.slug,
              title: project.title,
              summary: project.summary,
              description: project.description,
              problem: project.problem,
              solution: project.solution,
              features: project.features,
              techStack: project.techStack,
              architecture: project.architecture,
              outcomes: project.outcomes,
              lessonsLearned: project.lessonsLearned,
              links: project.links
            }
          : null
      }
    };
  }

  if (mode === "about") {
    return {
      mode,
      sources,
      context: {
        profile: sharedProfile,
        experience: experienceTimeline.map((item) => ({
          role: item.role,
          company: item.company,
          type: item.type,
          location: item.location,
          period: `${item.startDate} to ${item.endDate}`,
          highlights: item.highlights
        })),
        skills: skillGroups,
        currentlyBuilding
      }
    };
  }

  if (mode === "recruiter") {
    const contentSignals = await loadContentSignals();

    return {
      mode,
      sources,
      context: {
        profile: sharedProfile,
        skills: skillGroups,
        experience: experienceTimeline.map((item) => ({
          role: item.role,
          company: item.company,
          type: item.type,
          period: `${item.startDate} to ${item.endDate}`,
          highlights: item.highlights
        })),
        projects: projects.map((project) => ({
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          problem: project.problem,
          solution: project.solution,
          techStack: project.techStack,
          outcomes: project.outcomes
        })),
        recruiterBrief: {
          roleFit: recruiterRoleFit,
          strongestAreas: recruiterStrongestAreas,
          productExposure: recruiterProductExposure,
          quickFacts: recruiterQuickFacts,
          projectProof: recruiterProofItems,
          likelyContributions: recruiterLikelyContributions,
          faq: recruiterFaq
        },
        currentlyBuilding,
        contentSignals
      }
    };
  }

  const contentSignals = await loadContentSignals();

  return {
    mode,
    sources,
    context: {
      profile: sharedProfile,
      skills: skillGroups,
      projects: projects.map((project) => ({
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        techStack: project.techStack,
        category: project.category,
        featured: project.featured
      })),
      services: services.map((service) => ({
        slug: service.slug,
        title: service.title,
        summary: service.summary,
        deliverables: service.deliverables
      })),
      experience: experienceTimeline.map((item) => ({
        role: item.role,
        company: item.company,
        type: item.type,
        period: `${item.startDate} to ${item.endDate}`,
        highlights: item.highlights
      })),
      currentlyBuilding,
      contentSignals
    }
  };
}

function unavailableWithDirection(mode: AIContextMode): string {
  if (mode === "project") {
    return "I don't see that information here. I can answer about this project's problem, stack, implementation, and recruiter relevance.";
  }

  if (mode === "recruiter") {
    return "I don't see that information here. I can answer using role fit, project proof, stack strengths, and current focus from this portfolio.";
  }

  if (mode === "about") {
    return "I don't see that information here. I can answer about background, education path, and current technical direction.";
  }

  return "I don't see that information here. I can answer from portfolio profile, projects, and current focus.";
}

function fallbackAnswer(query: string, bundle: GroundingBundle, persona: AIPersona): AIResponseBody {
  const lower = query.toLowerCase();
  const confidence = inferConfidence(query);

  if (bundle.mode === "project") {
    const projectData = bundle.context.project as
      | {
          title: string;
          summary: string;
          problem: string;
          solution: string;
          techStack: string[];
          features: string[];
        }
      | null
      | undefined;

    if (!projectData) {
      return {
        answer: "I don't see that project data here.",
        confidence: "low",
        sources: bundle.sources
      };
    }

    if (lower.includes("problem")) {
      return {
        answer: `${projectData.title} solves this problem: ${projectData.problem}`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("tech") || lower.includes("stack")) {
      return {
        answer: `${projectData.title} uses ${projectData.techStack.join(", ")}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("personally built") || lower.includes("what did")) {
      return {
        answer: `${projectData.title}: ${projectData.solution} Key parts include ${projectData.features.join(", ")}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    return {
      answer: `${projectData.title}: ${projectData.summary} Problem: ${projectData.problem} Solution: ${projectData.solution}`,
      confidence,
      sources: bundle.sources
    };
  }

  if (bundle.mode === "recruiter") {
    if (lower.includes("role") || lower.includes("fit")) {
      return {
        answer: `Best fit roles: ${recruiterRoleFit.map((item) => item.role).join("; ")}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("strongest") || lower.includes("skill") || lower.includes("stack")) {
      return {
        answer: `Strongest technical areas: ${recruiterStrongestAreas.join(" ")}`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("project")) {
      return {
        answer: `Recruiter-priority project proof: ${recruiterProofItems
          .map((item) => `${item.projectName} (${item.label})`)
          .join("; ")}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }
  }

  if (bundle.mode === "about") {
    if (lower.includes("background")) {
      return {
        answer: profile.longBio,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("current focus") || lower.includes("learning")) {
      return {
        answer: `Current focus: ${profile.currentlyFocusing.join("; ")}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }
  }

  if (lower.includes("summarize") || lower.includes("overview")) {
    return {
      answer:
        `${profile.name} is currently pursuing an M.E. in AI while building practical full-stack products. ` +
        "The strongest work combines React/Next.js frontend execution, Node/Express backend workflows, and applied AI feature integration with grounding guardrails.",
      confidence: persona === "general" ? "medium" : "high",
      sources: bundle.sources
    };
  }

  return {
    answer: unavailableWithDirection(bundle.mode),
    confidence,
    sources: bundle.sources
  };
}

export async function generatePortfolioAnswer(
  query: string,
  options: AIQueryOptions = {}
): Promise<AIResponseBody> {
  const persona = options.persona || "general";
  const mode = resolveMode(options.mode);
  const bundle = await buildGroundingBundle(mode, options.projectSlug);

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!apiKey) {
    return fallbackAnswer(query, bundle, persona);
  }

  const systemPrompt = [
    ...aiSystemRules,
    personaGuidance(persona),
    modeGuidance(mode),
    "If details are missing, explicitly reply with: I don't see that information here."
  ].join("\n");

  const userPrompt = `User question:
${query}

Grounding context JSON:
${JSON.stringify(bundle.context)}

Answer requirements:
- Keep it concise and useful.
- Use plain English.
- Do not include facts that are not in grounding context.
- If missing, say "I don't see that information here."`;

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
            temperature: 0.15,
            maxOutputTokens: 380
          }
        })
      }
    );

    if (!response.ok) {
      return fallbackAnswer(query, bundle, persona);
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
      return fallbackAnswer(query, bundle, persona);
    }

    return {
      answer,
      sources: bundle.sources,
      confidence: inferConfidence(query)
    };
  } catch {
    return fallbackAnswer(query, bundle, persona);
  }
}
