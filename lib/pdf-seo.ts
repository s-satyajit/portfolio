import fs from "node:fs/promises";
import path from "node:path";
import "server-only";

export interface PdfSeoSignals {
  summary: string;
  keywords: string[];
  articleBody: string;
  pageCount: number;
}

const STOPWORDS = new Set([
  "about",
  "after",
  "again",
  "also",
  "been",
  "before",
  "being",
  "between",
  "could",
  "does",
  "each",
  "from",
  "have",
  "into",
  "just",
  "more",
  "most",
  "much",
  "only",
  "other",
  "over",
  "same",
  "some",
  "such",
  "than",
  "that",
  "their",
  "them",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "under",
  "very",
  "what",
  "when",
  "where",
  "which",
  "while",
  "with",
  "would",
  "your"
]);

const seoCache = new Map<string, Promise<PdfSeoSignals | null>>();

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function toPublicFilePath(pdfUrl: string): string | null {
  if (!pdfUrl.startsWith("/")) {
    return null;
  }

  const publicRoot = path.join(process.cwd(), "public");
  const resolved = path.normalize(path.join(publicRoot, pdfUrl));

  if (!resolved.startsWith(publicRoot)) {
    return null;
  }

  if (!resolved.toLowerCase().endsWith(".pdf")) {
    return null;
  }

  return resolved;
}

function extractKeywords(text: string, limit = 12): string[] {
  const frequencies = new Map<string, number>();
  const words = text.toLowerCase().match(/[a-z][a-z0-9-]{3,}/g) ?? [];

  for (const word of words) {
    if (STOPWORDS.has(word)) {
      continue;
    }
    frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
  }

  return [...frequencies.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

async function parsePdfForSeo(pdfUrl: string): Promise<PdfSeoSignals | null> {
  const localPath = toPublicFilePath(pdfUrl);
  if (!localPath) {
    return null;
  }

  try {
    const buffer = await fs.readFile(localPath);
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    await parser.destroy();
    const text = normalizeWhitespace(parsed.text);

    if (!text) {
      return null;
    }

    return {
      summary: text.slice(0, 320),
      keywords: extractKeywords(text),
      articleBody: text.slice(0, 5000),
      pageCount: parsed.total
    };
  } catch {
    return null;
  }
}

export async function getPdfSeoSignals(pdfUrl?: string): Promise<PdfSeoSignals | null> {
  if (!pdfUrl) {
    return null;
  }

  const cacheKey = pdfUrl;
  const cached = seoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const task = parsePdfForSeo(pdfUrl);
  seoCache.set(cacheKey, task);
  return task;
}
