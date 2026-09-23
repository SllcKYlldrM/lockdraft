import slugify from "slugify";
import { callLLM } from "../llm/provider.ts";
import { extractJson } from "../llm/json.ts";
import { getSourceText } from "../article-fetcher.ts";
import type { NewsCandidate, GuideBrief, GuideFactPack, Article } from "../types.ts";
import type { TopicDefinition } from "../../adapters/site-context.ts";
import { limits } from "../../../agent.config.ts";

const SYSTEM = `You are a technical writer for LockDraft, a site covering
AI, automation, and AI agents — practical, no hype. Write in clear, direct
English aimed at developers and automation practitioners. Never copy
sentences from source material — read it, understand it, and explain it in
your own words. Never invent API names, parameters, version numbers, or
quotes that aren't in the provided source material. Output only valid
JSON, no prose outside the JSON.`;

interface WriterOutput {
  title: string;
  description: string;
  tags: string[];
  body: string;
}

function toSlug(title: string): string {
  return slugify(title, { lower: true, strict: true }).slice(0, 80);
}

function baseTags(topic: TopicDefinition | undefined, extra: string[]): string[] {
  const tags = new Set(extra.slice(0, 5));
  if (topic) tags.add(topic.id);
  return [...tags].slice(0, 6);
}

/** Writes a fully original news article from a scored candidate. */
export async function writeNewsArticle(
  candidate: NewsCandidate,
  topic: TopicDefinition | undefined,
  revisionIssues?: string[],
): Promise<Article> {
  const { item } = candidate;
  const fullText = await getSourceText(item);

  const youtubeCaveat =
    item.kind === "youtube"
      ? `\nIMPORTANT: the source content above is a YouTube video's title and
description only — you do not have the transcript or the video itself.
Do not describe, name, or quantify anything (a feature, parameter, number,
date) that isn't written explicitly in that text, even if it sounds
plausible for this topic. If the description doesn't explain a claim it
makes, either skip that claim or note that the video covers it without
elaborating — never fill the gap yourself.\n`
      : "";

  const prompt = `Write an original news article based on this source
material. Do not copy phrasing — rewrite entirely in your own words.

Topic: ${topic?.name ?? item.topic ?? "N/A"}
News type: ${candidate.newsType}
Source: ${item.sourceName} (${item.sourceUrl})
Source headline: ${item.title}
Source content:
"""
${fullText}
"""
${youtubeCaveat}${revisionIssues?.length ? `\nThe previous draft had these issues — fix them:\n${revisionIssues.map((i) => `- ${i}`).join("\n")}\n` : ""}
Be specific, not generic. Pull out and use the actual names, numbers, and
details present in the source content above (model/product names, exact
API/parameter changes, version numbers, dates, benchmark figures, etc.) —
a reader who already follows this space should learn something concrete,
not just that "improvements were made." If the source content is too thin
to be specific about, say so plainly rather than padding with vague filler
sentences.

Structure the body in Markdown with these H2 sections when the source
supports them. Do not pad a short source with generic advice; a concise,
fact-dense article is better than repeated context:
## What changed
## Why it matters
## What to do next

Respond with ONLY this JSON shape:
{"title": "...", "description": "...(<=155 chars, no quotes)", "tags": ["...", "..."], "body": "...(markdown, starting at ## What changed)"}`;

  const response = await callLLM("writer", [
    { role: "system", content: SYSTEM },
    { role: "user", content: prompt },
  ]);
  const out = extractJson<WriterOutput>(response);

  return {
    kind: "news",
    body: out.body.trim(),
    frontmatter: {
      title: out.title.trim(),
      slug: toSlug(out.title),
      description: out.description.trim().slice(0, 160),
      category: topic?.category ?? "ai-news",
      topic: topic?.id,
      tags: baseTags(topic, [...(out.tags ?? []), "ai-news"]),
      published: new Date().toISOString(),
      author: "LockDraft Agent",
      draft: false,
      sourceUrl: item.sourceUrl,
      sourceName: item.sourceName,
      newsType: candidate.newsType,
    },
  };
}

/** Writes a long-form guide from a planner brief. */
export async function writeGuideArticle(
  brief: GuideBrief,
  topic: TopicDefinition | undefined,
  relatedTitles: string[],
  factPack: GuideFactPack,
  revisionIssues?: string[],
): Promise<Article> {
  const prompt = `Write an original, in-depth ${brief.guideType} guide.

Topic: ${topic?.name ?? brief.topic ?? "N/A"} (${topic?.shortDescription ?? ""})
Angle: ${brief.angle}
Related existing posts on this site (for internal-link context, do not
invent URLs, just mention them naturally by title if relevant): ${relatedTitles.join(", ") || "none yet"}
Grounding fact pack (official/source-backed context):
"""
${factPack.verifiedText}
"""
Limitations:
${factPack.limitations.map((item) => `- ${item}`).join("\n") || "- No additional limitations."}
${revisionIssues?.length ? `\nThe previous draft had these issues — fix them:\n${revisionIssues.map((i) => `- ${i}`).join("\n")}\n` : ""}
Requirements:
- At least ${limits.minGuideWordsByType[brief.guideType]} words.
- At least ${limits.minGuideTablesByType[brief.guideType]} meaningful Markdown table(s).
- Include at least one concrete, runnable code block (a CLI command, a
  config snippet, a workflow JSON fragment, or similar) when the topic
  supports it — no purely abstract prose guides.
- Use H2 (##) and H3 (###) headings; each heading's text must be unique.
- Include a final "## Sources" section noting this is original analysis
  and link to the official URL when available: ${factPack.officialUrl || "no official URL available"}.
- Preserve the source's terminology exactly. Do not turn a descriptive
  sentence into a new proper-noun feature, parameter, or product name.
- If the source combines multiple features or concepts without a clear
  boundary, describe that ambiguity instead of inventing a separate label.
- Keep general advice clearly framed as advice; it must not imply an exact
  API signature, parameter, default value, or UI location absent from the
  pack.
- Do not invent specific version numbers, dates, benchmark numbers, API
  parameters, pricing, or limits. If a detail is uncertain, qualify it or
  omit it rather than guessing.

Respond with ONLY this JSON shape:
{"title": "...", "description": "...(<=155 chars)", "tags": ["...", "..."], "body": "...(markdown, starting at the first ## heading)"}`;

  const response = await callLLM("writer", [
    { role: "system", content: SYSTEM },
    { role: "user", content: prompt },
  ]);
  const out = extractJson<WriterOutput>(response);

  return {
    kind: "guides",
    body: out.body.trim(),
    frontmatter: {
      title: out.title.trim(),
      slug: toSlug(out.title),
      description: out.description.trim().slice(0, 160),
      category: brief.category,
      topic: topic?.id,
      tags: baseTags(topic, [...(out.tags ?? []), brief.guideType]),
      published: new Date().toISOString(),
      author: "LockDraft Agent",
      draft: false,
      guideType: brief.guideType,
      relatedGuides: brief.relatedGuideSlugs,
    },
  };
}
