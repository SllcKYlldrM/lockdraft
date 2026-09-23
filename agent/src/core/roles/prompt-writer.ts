import slugify from "slugify";
import { callLLM } from "../llm/provider.ts";
import { extractJson } from "../llm/json.ts";
import type { PromptArticle, PromptCandidate, PromptDifficulty } from "../types.ts";

const VALID_DIFFICULTIES: PromptDifficulty[] = ["beginner", "intermediate", "advanced"];

const SYSTEM = `You write reusable AI prompt templates for LockDraft, a
site covering AI, automation, and AI agents — practical, no hype. Each
entry is a fill-in-the-blank prompt template a developer or automation
practitioner can copy, adapt with their own details, and paste into
Claude/GPT/Gemini — not a one-off answer to a single question. Output only
valid JSON, no prose outside the JSON.`;

interface WriterOutput {
  title: string;
  description: string;
  tags: string[];
  models: string[];
  difficulty: string;
  promptTemplate: string;
  whenToUse: string;
  tips: string[];
}

function toSlug(title: string): string {
  return slugify(title, { lower: true, strict: true }).slice(0, 80);
}

/** Writes an original, reusable prompt template for the given category gap. */
export async function writePrompt(
  candidate: PromptCandidate,
  revisionIssues?: string[],
): Promise<PromptArticle> {
  const prompt = `Write one new, original, reusable prompt template for the
"${candidate.category}" category.

Existing prompts already published in this category (do not duplicate
their purpose or angle — pick something genuinely different that a
developer/automation practitioner would reach for):
${candidate.existingTitles.length ? candidate.existingTitles.map((t) => `- ${t}`).join("\n") : "- (none yet)"}
${revisionIssues?.length ? `\nThe previous draft had these issues — fix them:\n${revisionIssues.map((i) => `- ${i}`).join("\n")}\n` : ""}
Requirements for the prompt template itself:
- Must be genuinely reusable: use {{placeholder}} fields for anything that
  varies per use (the user's actual code, error, topic, notes, etc.) —
  never a prompt that only makes sense for one specific, already-answered
  question.
- Give the model doing the task explicit structure to follow in its
  response (a numbered list of what to produce, not just "help me with X").
- Where it matters, include an instruction that keeps the model honest:
  telling it to flag missing/ambiguous information instead of guessing,
  or to say so explicitly rather than inventing specifics.
- Keep it focused on one clear task, not a vague multi-purpose prompt.

Also write:
- A short list of relevant models this prompt works well with, from:
  Claude, GPT, Gemini (pick 2-3 that plausibly apply — most general
  prompts work with all three).
- A difficulty: "beginner" (usable with minimal setup), "intermediate"
  (requires some judgment to fill placeholders well), or "advanced"
  (requires real domain expertise to use the output correctly).
- A "When to use this" paragraph (2-3 sentences): the concrete situation
  where someone would reach for this prompt.
- 2 "Tips" bullets: practical advice for getting better results from it
  (what to paste in, how to follow up), not generic advice.

Respond with ONLY this JSON shape:
{"title": "...", "description": "...(<=155 chars)", "tags": ["...", "...", "..."], "models": ["Claude", "GPT"], "difficulty": "beginner", "promptTemplate": "...(the reusable prompt text, with {{placeholders}})", "whenToUse": "...(1 short paragraph)", "tips": ["tip 1", "tip 2"]}`;

  const response = await callLLM("writer", [
    { role: "system", content: SYSTEM },
    { role: "user", content: prompt },
  ]);
  const out = extractJson<WriterOutput>(response);

  const difficulty: PromptDifficulty = VALID_DIFFICULTIES.includes(
    out.difficulty as PromptDifficulty,
  )
    ? (out.difficulty as PromptDifficulty)
    : "intermediate";

  const body = [
    "## When to use this",
    "",
    out.whenToUse.trim(),
    "",
    "## Tips",
    "",
    ...(out.tips ?? []).slice(0, 4).map((tip) => `- ${tip}`),
  ].join("\n");

  return {
    promptTemplate: out.promptTemplate.trim(),
    body,
    frontmatter: {
      title: out.title.trim(),
      slug: toSlug(out.title),
      description: out.description.trim().slice(0, 160),
      category: candidate.category,
      models: (out.models ?? []).filter((m) => ["Claude", "GPT", "Gemini"].includes(m)).slice(0, 3),
      tags: (out.tags ?? []).slice(0, 6),
      difficulty,
      published: new Date().toISOString(),
      draft: false,
    },
  };
}
