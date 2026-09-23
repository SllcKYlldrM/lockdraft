import { callLLM, type ModelRef } from "../llm/provider.ts";
import { extractJson } from "../llm/json.ts";
import { limits } from "../../../agent.config.ts";
import type { Article, EditorVerdict, PromptArticle } from "../types.ts";

function countTables(body: string): number {
  return (body.match(/^\|.*\|$/gm) ?? [])
    .filter((line) => /^\|[-:\s|]+\|$/.test(line)).length; // table separator rows
}

function countWords(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

function hasDuplicateHeadings(body: string): boolean {
  const headings = [...body.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) =>
    (m[1] ?? "").trim().toLowerCase(),
  );
  return new Set(headings).size !== headings.length;
}

/**
 * Runs mechanical checks first (cheap, deterministic), then an LLM
 * fact/quality pass. Mechanical failures short-circuit straight to
 * "revise" without spending an LLM call.
 */
export async function reviewArticle(
  article: Article,
  sourceText?: string,
  modelOverride?: ModelRef,
): Promise<EditorVerdict> {
  const mechanicalIssues: string[] = [];

  if (article.kind === "guides") {
    const words = countWords(article.body);
    const guideType = article.frontmatter.guideType ?? "explainer";
    const minWords = limits.minGuideWordsByType[guideType];
    const minTables = limits.minGuideTablesByType[guideType];
    if (words < minWords) {
      mechanicalIssues.push(
        `Body is ${words} words, needs at least ${minWords} for a ${guideType} guide.`,
      );
    }
    const tables = countTables(article.body);
    if (tables < minTables) {
      mechanicalIssues.push(
        `Body has ${tables} Markdown table(s), needs at least ${minTables} for a ${guideType} guide.`,
      );
    }
  }
  if (article.kind === "news") {
    const words = countWords(article.body);
    if (words < limits.minNewsWords) {
      mechanicalIssues.push(
        `Body is ${words} words, needs at least ${limits.minNewsWords} (too thin/filler-heavy).`,
      );
    }
  }
  if (hasDuplicateHeadings(article.body)) {
    mechanicalIssues.push("Body has duplicate H2/H3 heading text.");
  }
  if (article.frontmatter.description.length > 160) {
    mechanicalIssues.push("Description exceeds 160 characters.");
  }

  if (mechanicalIssues.length > 0) {
    return { status: "revise", issues: mechanicalIssues };
  }

  const prompt = sourceText
    ? `Review this ${article.kind === "news" ? "news article" : "guide"} for an AI/automation site. You are also given the
source material it was written from — use it as your primary reference.

The most reliable check: does every specific claim (product/model names,
numbers, dates, API/parameter names) in the article actually appear in or
follow from the source material below? Flag anything that doesn't. Do NOT
flag a claim just because it's unfamiliar to you personally — a fast-moving
AI ecosystem can post-date your own training data, but if it's genuinely
present in the source material it's not fabricated. Separate sourced facts
from editorial analysis: analysis is acceptable when clearly framed as
interpretation, but it must not introduce new specific facts, invented
capabilities, or unsupported instructions. Still flag filler with no
substance, tone issues, or contradictions. For a guide, treat the
grounding pack as the authority for topic-specific claims. If it does not
contain a detail, require the writer to qualify it or remove it rather
than presenting an exact claim as verified.

Source material:
"""
${sourceText}
"""

Title: ${article.frontmatter.title}
Description: ${article.frontmatter.description}
Body:
"""
${article.body}
"""

Respond with ONLY this JSON shape:
{"status": "pass" | "revise" | "reject", "issues": ["short issue 1", ...]}
Use "revise" for fixable problems, "reject" only if the piece is
fundamentally unsalvageable (e.g. off-topic, incoherent).`
    : `Review this ${article.kind === "news" ? "news article" : "guide"}
for an AI/automation site. Check for: fabricated specific numbers/dates, factual
inaccuracies, filler with no substance, tone issues, and advice presented
as fact. Be especially careful with API signatures, parameter names,
default values, version numbers, and pricing — these are easy to get
subtly wrong and hard for a reader to catch.

Title: ${article.frontmatter.title}
Description: ${article.frontmatter.description}
Body:
"""
${article.body}
"""

Respond with ONLY this JSON shape:
{"status": "pass" | "revise" | "reject", "issues": ["short issue 1", ...]}
Use "revise" for fixable problems, "reject" only if the piece is
fundamentally unsalvageable (e.g. off-topic, incoherent).`;

  try {
    const response = await callLLM("editor", [
      { role: "system", content: "You are a meticulous copy editor. Output only valid JSON." },
      { role: "user", content: prompt },
    ], modelOverride);
    const verdict = extractJson<EditorVerdict>(response);
    if (!["pass", "revise", "reject"].includes(verdict.status)) {
      return { status: "revise", issues: ["Editor returned an unrecognized status."] };
    }
    return verdict;
  } catch (err) {
    // Editor LLM call itself failed (provider outage, missing/invalid key,
    // bad JSON). This is an infrastructure failure, not a verdict on the
    // article's quality — rethrow so the caller treats it as a transient
    // error (retry next run) instead of a permanent content rejection.
    throw new Error(`Editor LLM call failed: ${(err as Error).message}`);
  }
}

/**
 * Reviews a prompt-collection entry. Mechanical checks first: the template
 * must actually be reusable ({{placeholder}} present) and the body must
 * have both required sections. Then an LLM pass for genuine reusability,
 * duplication, and instruction quality — a prompt template has different
 * failure modes than a news/guide article (there's no source text to
 * fact-check against; the risk is a disguised one-off answer instead).
 */
export async function reviewPrompt(
  article: PromptArticle,
  existingTitlesInCategory: string[],
): Promise<EditorVerdict> {
  const mechanicalIssues: string[] = [];

  if (!/\{\{[a-zA-Z0-9_]+\}\}/.test(article.promptTemplate)) {
    mechanicalIssues.push(
      "Prompt template has no {{placeholder}} fields — it reads like a one-off answer, not a reusable template.",
    );
  }
  if (!/^##\s+When to use this/im.test(article.body)) {
    mechanicalIssues.push('Body is missing a "## When to use this" section.');
  }
  if (!/^##\s+Tips/im.test(article.body)) {
    mechanicalIssues.push('Body is missing a "## Tips" section.');
  }
  if (article.frontmatter.description.length > 160) {
    mechanicalIssues.push("Description exceeds 160 characters.");
  }
  if (article.frontmatter.title.length > 100) {
    mechanicalIssues.push("Title exceeds 100 characters.");
  }

  if (mechanicalIssues.length > 0) {
    return { status: "revise", issues: mechanicalIssues };
  }

  const prompt = `Review this reusable AI prompt template for an
AI/automation site's prompt library. Check for:

1. Genuine reusability — every {{placeholder}} should stand in for
   information that varies per use. Flag it if the template is really a
   disguised one-off question (specific details baked in that should be a
   placeholder instead).
2. Whether the instructions it gives the model being prompted are concrete
   and structured, not vague ("help me with X").
3. Whether it duplicates the purpose of an existing prompt too closely —
   check against this category's existing titles: ${existingTitlesInCategory.join(", ") || "(none yet)"}
4. Tone/filler issues in the "When to use this" and "Tips" sections.

Title: ${article.frontmatter.title}
Description: ${article.frontmatter.description}
Difficulty: ${article.frontmatter.difficulty}
Prompt template:
"""
${article.promptTemplate}
"""
Body:
"""
${article.body}
"""

Respond with ONLY this JSON shape:
{"status": "pass" | "revise" | "reject", "issues": ["short issue 1", ...]}
Use "revise" for fixable problems, "reject" only if the piece is
fundamentally unsalvageable (off-topic, incoherent, or not really a
prompt at all).`;

  try {
    const response = await callLLM("editor", [
      { role: "system", content: "You are a meticulous copy editor. Output only valid JSON." },
      { role: "user", content: prompt },
    ]);
    const verdict = extractJson<EditorVerdict>(response);
    if (!["pass", "revise", "reject"].includes(verdict.status)) {
      return { status: "revise", issues: ["Editor returned an unrecognized status."] };
    }
    return verdict;
  } catch (err) {
    throw new Error(`Editor LLM call failed: ${(err as Error).message}`);
  }
}
