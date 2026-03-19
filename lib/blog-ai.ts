import { getBlogPostBySlug } from "@/lib/mdx";

type BlogAIMode = "summary" | "takeaways" | "simple" | "faq" | "ask";

interface GenerateBlogAIInput {
  slug: string;
  mode: BlogAIMode;
  question?: string;
}

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

function compactText(source: string, maxChars = 14000): string {
  if (source.length <= maxChars) return source;
  return `${source.slice(0, maxChars)}\n\n[Truncated for token safety]`;
}

function modeInstruction(mode: BlogAIMode, question?: string): string {
  switch (mode) {
    case "summary":
      return "Write a concise professional summary in 6-8 bullet points.";
    case "takeaways":
      return "Extract the most practical key takeaways as numbered points.";
    case "simple":
      return "Explain the article in simple language for a non-expert engineer.";
    case "faq":
      return "Generate 5 useful FAQs with short answers based only on the article.";
    case "ask":
      return `Answer this question using only article context: ${question || ""}`;
    default:
      return "Provide a concise grounded answer.";
  }
}

function localFallback(mode: BlogAIMode, title: string, excerpt: string, question?: string): string {
  if (mode === "summary") {
    return `Summary for "${title}":\n- ${excerpt}\n- Focuses on practical engineering decisions.\n- Connects implementation choices to product outcomes.`;
  }
  if (mode === "takeaways") {
    return `1. Understand the core problem first.\n2. Prefer maintainable architecture choices.\n3. Document tradeoffs clearly.\n4. Connect technical decisions to user value.`;
  }
  if (mode === "faq") {
    return `Q: What is this article about?\nA: ${excerpt}\n\nQ: Who is this useful for?\nA: Engineers, recruiters, and technical readers exploring practical system thinking.`;
  }
  if (mode === "simple") {
    return `In simple terms: this article explains a real engineering topic in a practical, easy-to-apply way, focused on decisions and outcomes.`;
  }
  return `I can answer this once Gemini is configured. Current question: ${question || "No question provided."}`;
}

export async function generateBlogAI(input: GenerateBlogAIInput): Promise<string> {
  const post = await getBlogPostBySlug(input.slug);
  if (!post) {
    throw new Error("Article not found");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return localFallback(input.mode, post.title, post.excerpt, input.question);
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  const instruction = modeInstruction(input.mode, input.question);
  const prompt = `You are an assistant for a technical blog.
Rules:
- Use only the article content given.
- Do not fabricate claims.
- Keep answer concise and practical.
- If answer is not present in article, clearly say so.

Article title: ${post.title}
Article excerpt: ${post.excerpt}
Article content:
${compactText(post.content)}

Task:
${instruction}`;

  try {
    const response = await fetch(
      `${GEMINI_ENDPOINT}/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 500
          }
        })
      }
    );

    if (!response.ok) {
      return localFallback(input.mode, post.title, post.excerpt, input.question);
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

    return answer || localFallback(input.mode, post.title, post.excerpt, input.question);
  } catch {
    return localFallback(input.mode, post.title, post.excerpt, input.question);
  }
}
