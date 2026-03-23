import { aiSystemRules } from "@/data/ai-grounding";
import { contactProcessSteps, contactResponseCommitments } from "@/data/contact";
import { currentlyBuilding } from "@/data/currently-building";
import { experienceTimeline } from "@/data/experience";
import { profile } from "@/data/profile";
import { getProjects } from "@/data/projects";
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
import {
  getAllBlogPosts,
  getAllCaseStudies,
  getAllResearchEntries,
  getBlogPostBySlug,
  getCaseStudyBySlug,
  getResearchBySlug
} from "@/lib/mdx";
import { AIConfidence, AIContextMode, AIQueryOptions, AIPersona, AIResponseBody } from "@/types/ai";

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

interface GroundingBundle {
  mode: AIContextMode;
  sources: string[];
  context: Record<string, unknown>;
  projectSlug?: string;
  entrySlug?: string;
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
    case "insights":
      return "Mode context is research and case-study navigation. Prioritize depth, clarity, and practical relevance.";
    case "blog":
      return "Mode context is a blog page. Prioritize article understanding, practical takeaways, and role relevance.";
    case "research":
      return "Mode context is a specific research entry. Focus on contribution, significance, and practical interpretation.";
    case "case-study":
      return "Mode context is a specific case study. Focus on problem framing, decisions, and engineering reasoning.";
    case "services":
      return "Mode context is client services. Keep answers scoped, practical, and clear about what can be delivered.";
    case "experience":
      return "Mode context is experience and current direction. Keep answers concise, factual, and role-relevant.";
    case "contact":
      return "Mode context is contact and collaboration intake. Focus on fit, scope clarity, and practical next steps.";
    case "resume":
      return "Mode context is resume evaluation. Answer like a concise recruiter screen with concrete project and skill evidence.";
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

  if (mode === "blog") {
    return ["blog", "projects", "profile"];
  }

  if (mode === "research") {
    return ["research", "profile", "skills"];
  }

  if (mode === "case-study") {
    return ["case-study", "projects", "profile"];
  }

  if (mode === "insights") {
    return ["research", "case-study", "projects", "profile"];
  }

  if (mode === "services") {
    return ["services", "projects", "profile", "contact"];
  }

  if (mode === "experience") {
    return ["experience", "currently-building", "projects", "profile"];
  }

  if (mode === "resume") {
    return ["profile", "experience", "skills", "projects", "recruiter-brief"];
  }

  if (mode === "contact") {
    return ["profile", "services", "projects", "contact"];
  }

  if (mode === "about") {
    return ["profile", "experience", "skills", "currently-building", "projects"];
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

async function buildGroundingBundle(
  mode: AIContextMode,
  projectSlug?: string,
  entrySlug?: string,
  projectsData: ReturnType<typeof getProjects> = getProjects()
): Promise<GroundingBundle> {
  const projects = projectsData;
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
    currentlyFocusing: profile.currentlyFocusing,
    aboutIntro: profile.aboutIntro,
    focusNow: profile.focusNow,
    journey: profile.journey,
    stackByCategory: profile.stackByCategory,
    personalNote: profile.personalNote,
    opportunityTargets: profile.opportunityTargets
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

  if (mode === "blog") {
    const [entry, contentSignals] = await Promise.all([
      entrySlug ? getBlogPostBySlug(entrySlug) : Promise.resolve(null),
      loadContentSignals()
    ]);

    return {
      mode,
      sources,
      entrySlug,
      context: {
        profile: {
          name: sharedProfile.name,
          title: sharedProfile.title,
          currentlyFocusing: sharedProfile.currentlyFocusing
        },
        article: entry
          ? {
              slug: entry.slug,
              title: entry.title,
              subtitle: entry.subtitle,
              excerpt: entry.excerpt,
              date: entry.date,
              tags: entry.tags,
              audience: entry.audience,
              category: entry.category,
              projectMentions: entry.projectMentions
            }
          : null,
        contentSignals,
        projects: projects
          .filter((item) => item.featured)
          .slice(0, 3)
          .map((item) => ({
            slug: item.slug,
            title: item.title,
            summary: item.summary
          }))
      }
    };
  }

  if (mode === "research") {
    const entry = entrySlug ? await getResearchBySlug(entrySlug) : null;

    return {
      mode,
      sources,
      entrySlug,
      context: {
        profile: {
          name: sharedProfile.name,
          title: sharedProfile.title,
          currentlyFocusing: sharedProfile.currentlyFocusing
        },
        research: entry
          ? {
              slug: entry.slug,
              title: entry.title,
              status: entry.status,
              summary: entry.summary,
              abstract: entry.abstract,
              contribution: entry.contribution,
              venue: entry.venue,
              tags: entry.tags
            }
          : null,
        projects: projects
          .filter((item) => item.featured)
          .slice(0, 3)
          .map((item) => ({
            slug: item.slug,
            title: item.title,
            summary: item.summary
          }))
      }
    };
  }

  if (mode === "case-study") {
    const entry = entrySlug ? await getCaseStudyBySlug(entrySlug) : null;

    return {
      mode,
      sources,
      entrySlug,
      context: {
        profile: {
          name: sharedProfile.name,
          title: sharedProfile.title,
          currentlyFocusing: sharedProfile.currentlyFocusing
        },
        caseStudy: entry
          ? {
              slug: entry.slug,
              title: entry.title,
              subtitle: entry.subtitle,
              overview: entry.overview,
              context: entry.context,
              problem: entry.problem,
              approach: entry.approach,
              analysis: entry.analysis,
              conclusion: entry.conclusion,
              toolsOrMethods: entry.toolsOrMethods,
              keyInsights: entry.keyInsights,
              learnings: entry.learnings,
              tags: entry.tags,
              pdf: entry.pdf,
              pdfReferences: entry.pdfReferences
            }
          : null,
        relatedProjects: projects
          .filter((item) => item.hasCaseStudy)
          .slice(0, 4)
          .map((item) => ({
            slug: item.slug,
            title: item.title,
            summary: item.summary
          }))
      }
    };
  }

  if (mode === "insights") {
    const contentSignals = await loadContentSignals();

    return {
      mode,
      sources,
      context: {
        profile: {
          name: sharedProfile.name,
          title: sharedProfile.title,
          currentlyFocusing: sharedProfile.currentlyFocusing
        },
        contentSignals,
        projectSignals: projects
          .filter((item) => item.featured)
          .slice(0, 4)
          .map((item) => ({
            slug: item.slug,
            title: item.title,
            summary: item.summary
          }))
      }
    };
  }

  if (mode === "services") {
    return {
      mode,
      sources,
      context: {
        profile: {
          name: sharedProfile.name,
          title: sharedProfile.title,
          availability: sharedProfile.availability,
          currentlyFocusing: sharedProfile.currentlyFocusing
        },
        services: services.map((item) => ({
          slug: item.slug,
          title: item.title,
          summary: item.summary,
          deliverables: item.deliverables,
          audience: item.audience
        })),
        projects: projects
          .filter((item) => item.featured)
          .slice(0, 3)
          .map((item) => ({
            slug: item.slug,
            title: item.title,
            summary: item.summary,
            category: item.category
          })),
        contact: {
          responseCommitments: contactResponseCommitments,
          process: contactProcessSteps
        }
      }
    };
  }

  if (mode === "experience") {
    return {
      mode,
      sources,
      context: {
        profile: {
          name: sharedProfile.name,
          title: sharedProfile.title,
          education: sharedProfile.education,
          currentlyFocusing: sharedProfile.currentlyFocusing
        },
        experience: experienceTimeline.map((item) => ({
          role: item.role,
          company: item.company,
          type: item.type,
          period: `${item.startDate} to ${item.endDate}`,
          highlights: item.highlights,
          tech: item.tech
        })),
        currentlyBuilding,
        projects: projects
          .filter((item) => item.featured)
          .slice(0, 3)
          .map((item) => ({
            slug: item.slug,
            title: item.title,
            summary: item.summary
          }))
      }
    };
  }

  if (mode === "contact") {
    const featuredProjects = projects.filter((item) => item.featured).slice(0, 4);

    return {
      mode,
      sources,
      context: {
        profile: {
          name: sharedProfile.name,
          title: sharedProfile.title,
          location: sharedProfile.location,
          email: profile.email,
          availability: sharedProfile.availability,
          currentlyFocusing: sharedProfile.currentlyFocusing
        },
        services: services.map((service) => ({
          slug: service.slug,
          title: service.title,
          summary: service.summary,
          deliverables: service.deliverables
        })),
        projects: featuredProjects.map((project) => ({
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          techStack: project.techStack,
          outcomes: project.outcomes
        })),
        contact: {
          responseCommitments: contactResponseCommitments,
          process: contactProcessSteps
        }
      }
    };
  }

  if (mode === "resume") {
    const contentSignals = await loadContentSignals();
    return {
      mode,
      sources,
      context: {
        profile: {
          name: sharedProfile.name,
          title: sharedProfile.title,
          location: sharedProfile.location,
          bio: sharedProfile.bio,
          education: sharedProfile.education,
          availability: sharedProfile.availability,
          currentlyFocusing: sharedProfile.currentlyFocusing
        },
        skills: skillGroups,
        experience: experienceTimeline.map((item) => ({
          role: item.role,
          company: item.company,
          type: item.type,
          period: `${item.startDate} to ${item.endDate}`,
          highlights: item.highlights,
          tech: item.tech
        })),
        projects: projects
          .filter((project) => project.featured)
          .map((project) => ({
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
          projectProof: recruiterProofItems
        },
        currentlyBuilding,
        contentSignals
      }
    };
  }

  if (mode === "about") {
    const highlightedProjects = projects
      .filter((item) => item.featured)
      .slice(0, 3)
      .map((project) => ({
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        techStack: project.techStack,
        outcomes: project.outcomes
      }));

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
        currentlyBuilding,
        highlightedProjects
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

  if (mode === "blog") {
    return "I don't see that information clearly in this article context yet. I can answer from article summary, tags, and project connections.";
  }

  if (mode === "research") {
    return "I don't see that information clearly in this research context yet. I can answer from summary, abstract, contribution, and tags.";
  }

  if (mode === "case-study") {
    return "I don't see that information clearly in this case-study context yet. I can answer from problem framing, analysis, and conclusion.";
  }

  if (mode === "insights") {
    return "I don't see that information clearly in insights context yet. I can help compare research and case-study entries available in this portfolio.";
  }

  if (mode === "services") {
    return "I don't see that information clearly in services context yet. I can answer from listed service scope, deliverables, and relevant project proof.";
  }

  if (mode === "experience") {
    return "I don't see that information clearly in experience context yet. I can answer from timeline, current focus, and active builds.";
  }

  if (mode === "resume") {
    return "I don't see that information here. I can answer from resume context: role fit, featured projects, skills, experience, and current focus.";
  }

  if (mode === "contact") {
    return "I don't see that information here. I can answer about outreach context, services, highlighted projects, and collaboration fit from this portfolio.";
  }

  if (mode === "recruiter") {
    return "I don't see that information here. I can answer using role fit, project proof, stack strengths, and current focus from this portfolio.";
  }

  if (mode === "about") {
    return "I don't see that information here. I can answer about background, education path, and current technical direction.";
  }

  return "I don't see that information here. I can answer from portfolio profile, projects, and current focus.";
}

function fallbackAnswer(
  query: string,
  bundle: GroundingBundle,
  persona: AIPersona,
  projectsData: ReturnType<typeof getProjects>
): AIResponseBody {
  const projects = projectsData;
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

  if (bundle.mode === "blog") {
    const article = bundle.context.article as
      | {
          title: string;
          excerpt: string;
          tags?: string[];
          projectMentions?: string[];
        }
      | null
      | undefined;

    if (!article) {
      return {
        answer: "I don't see that article context clearly in the portfolio yet.",
        confidence: "low",
        sources: bundle.sources
      };
    }

    if (lower.includes("summar") || lower.includes("main idea")) {
      return {
        answer: `${article.title}: ${article.excerpt}`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("project") || lower.includes("connect")) {
      const mentions = article.projectMentions?.length
        ? article.projectMentions.join("; ")
        : "No direct project mentions are listed for this article.";
      return {
        answer: `Project linkage: ${mentions}`,
        confidence: "medium",
        sources: bundle.sources
      };
    }
  }

  if (bundle.mode === "research") {
    const research = bundle.context.research as
      | { title: string; summary: string; contribution: string; status: string }
      | null
      | undefined;

    if (!research) {
      return {
        answer: "I don't see that research entry context clearly in the portfolio yet.",
        confidence: "low",
        sources: bundle.sources
      };
    }

    if (lower.includes("contribution") || lower.includes("main")) {
      return {
        answer: `Main contribution in ${research.title}: ${research.contribution}`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    return {
      answer: `${research.title} (${research.status}): ${research.summary}`,
      confidence: "high",
      sources: bundle.sources
    };
  }

  if (bundle.mode === "case-study") {
    const caseStudy = bundle.context.caseStudy as
      | { title: string; problem: string; analysis: string; conclusion: string }
      | null
      | undefined;

    if (!caseStudy) {
      return {
        answer: "I don't see that case-study context clearly in the portfolio yet.",
        confidence: "low",
        sources: bundle.sources
      };
    }

    if (lower.includes("problem")) {
      return {
        answer: `Problem in ${caseStudy.title}: ${caseStudy.problem}`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("decision") || lower.includes("analysis")) {
      return {
        answer: `Analysis summary: ${caseStudy.analysis}`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    return {
      answer: `${caseStudy.title}: ${caseStudy.conclusion}`,
      confidence: "high",
      sources: bundle.sources
    };
  }

  if (bundle.mode === "services") {
    if (lower.includes("build") || lower.includes("service") || lower.includes("client")) {
      return {
        answer: `Current service focus: ${services
          .slice(0, 4)
          .map((service) => service.title)
          .join("; ")}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }
  }

  if (bundle.mode === "experience") {
    if (lower.includes("focus") || lower.includes("current")) {
      return {
        answer: `Current focus: ${profile.currentlyFocusing.join("; ")}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("contribute") || lower.includes("role")) {
      return {
        answer:
          "Likely early contribution areas: frontend execution in React/Next.js, backend API integration, role-based workflows, and grounded AI feature implementation.",
        confidence: "medium",
        sources: bundle.sources
      };
    }
  }

  if (bundle.mode === "insights") {
    if (lower.includes("recruiter") || lower.includes("read first")) {
      return {
        answer:
          "For recruiter review, start with case studies that show system decisions, then read research notes that connect AI concepts to implementation choices.",
        confidence: "medium",
        sources: bundle.sources
      };
    }

    if (lower.includes("client")) {
      return {
        answer:
          "Client-facing readers should start with case studies that demonstrate product reasoning, then review related projects for execution proof.",
        confidence: "medium",
        sources: bundle.sources
      };
    }
  }

  if (bundle.mode === "contact") {
    if (lower.includes("response") || lower.includes("reply") || lower.includes("timeline")) {
      return {
        answer: "Typical first response window is 24-48 hours with a direct next-step reply when scope is clear.",
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("freelance") || lower.includes("client") || lower.includes("service")) {
      return {
        answer: `Freelance fit areas include: ${services
          .slice(0, 4)
          .map((service) => service.title)
          .join("; ")}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("job") || lower.includes("full-time") || lower.includes("internship")) {
      return {
        answer:
          "Yes, he is open to internship and full-time opportunities, and also accepts scoped freelance engagements.",
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("project") || lower.includes("proof") || lower.includes("review first")) {
      const topProjects = projects
        .filter((item) => item.featured)
        .slice(0, 3)
        .map((item) => item.title)
        .join("; ");
      return {
        answer: `Good projects to review first: ${topProjects}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }
  }

  if (bundle.mode === "resume") {
    if (lower.includes("summarize") || lower.includes("30 second")) {
      return {
        answer:
          `${profile.name} is an ${profile.title} currently pursuing an M.E. in AI. ` +
          "He ships end-to-end web products with React/Next.js and Node/Express, and is building practical AI features with grounding-focused reliability.",
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("role") || lower.includes("fit")) {
      return {
        answer: `Current best-fit roles: ${recruiterRoleFit.map((item) => item.role).join("; ")}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("project") || lower.includes("review first") || lower.includes("proof")) {
      const shortlisted = projects
        .filter((project) => project.featured)
        .slice(0, 3)
        .map((project) => project.title)
        .join("; ");
      return {
        answer: `Priority project evidence for screening: ${shortlisted}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("full-stack") || lower.includes("backend") || lower.includes("frontend")) {
      return {
        answer:
          "Execution is full-stack: frontend product interfaces, backend API workflows, role-based auth patterns, and deployment-ready delivery.",
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("ai")) {
      return {
        answer:
          "AI direction is practical: grounded assistant workflows, context-aware responses, and product-focused integration over hype-driven demos.",
        confidence: "high",
        sources: bundle.sources
      };
    }
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

    if (lower.includes("current focus") || lower.includes("learning") || lower.includes("focused")) {
      return {
        answer: `Current focus: ${profile.currentlyFocusing.join("; ")}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("why") && lower.includes("ai")) {
      return {
        answer: profile.aboutIntro.direction,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (
      lower.includes("role") ||
      lower.includes("opportunit") ||
      lower.includes("targeting")
    ) {
      return {
        answer: `Current targets: ${profile.opportunityTargets.join("; ")}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("more full-stack") || lower.includes("ai-focused")) {
      return {
        answer:
          "He is currently full-stack in execution with an intentional move toward applied AI, so the direction is AI-focused while keeping end-to-end product delivery skills.",
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("project") && lower.includes("strength")) {
      const strongest = projects.filter((project) => project.featured).slice(0, 3);
      return {
        answer: `Projects that best reflect current strengths: ${strongest
          .map((item) => item.title)
          .join("; ")}.`,
        confidence: "high",
        sources: bundle.sources
      };
    }

    if (lower.includes("different") || lower.includes("fresher")) {
      return {
        answer:
          "The portfolio shows end-to-end builds, clear role-based workflows, grounded AI integration, and technical writing that explains tradeoffs instead of only presenting UI output.",
        confidence: "medium",
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
  const projects = getProjects();
  const bundle = await buildGroundingBundle(mode, options.projectSlug, options.entrySlug, projects);

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!apiKey) {
    return fallbackAnswer(query, bundle, persona, projects);
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
      return fallbackAnswer(query, bundle, persona, projects);
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
      return fallbackAnswer(query, bundle, persona, projects);
    }

    return {
      answer,
      sources: bundle.sources,
      confidence: inferConfidence(query)
    };
  } catch {
    return fallbackAnswer(query, bundle, persona, projects);
  }
}
