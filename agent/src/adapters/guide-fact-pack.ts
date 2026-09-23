import { fetchArticleText } from "../core/article-fetcher.ts";
import type { TopicDefinition } from "./site-context.ts";
import type { GuideFactPack } from "../core/types.ts";

const MAX_OFFICIAL_TEXT = 6000;
const MIN_GUIDE_SOURCE_WORDS = 250;

function assessGuideSource(text: string | undefined): {
  ready: boolean;
  reason?: string;
} {
  const normalized = text?.replace(/\s+/g, " ").trim() ?? "";
  const words = normalized.split(/\s+/).filter(Boolean).length;
  if (!normalized) {
    return { ready: false, reason: "official source could not be extracted" };
  }
  if (words < MIN_GUIDE_SOURCE_WORDS) {
    return {
      ready: false,
      reason: `official source has only ${words} usable words; needs at least ${MIN_GUIDE_SOURCE_WORDS}`,
    };
  }
  return { ready: true };
}

/**
 * Builds a small grounding pack for guide generation. The pack is deliberately
 * source-first: if the official page is unavailable, the writer is told what
 * it cannot safely claim instead of being given fabricated replacement facts.
 */
export async function buildGuideFactPack(
  topic: TopicDefinition | undefined,
): Promise<GuideFactPack> {
  if (!topic) {
    return {
      topicName: "Unknown topic",
      topicId: "unknown",
      category: "unknown",
      officialUrl: "",
      verifiedText: "No topic definition was available.",
      limitations: ["Do not make exact topic-specific claims."],
      sourceReady: false,
      sourceReason: "topic definition was unavailable",
    };
  }

  const officialText = await fetchArticleText(topic.officialUrl);
  const sourceAssessment = assessGuideSource(officialText);
  const limitations: string[] = [];
  if (!officialText) {
    limitations.push(
      "The official page could not be extracted; do not invent current-specific facts, API names, parameters, or version numbers.",
    );
  }

  return {
    topicName: topic.name,
    topicId: topic.id,
    category: topic.category,
    officialUrl: topic.officialUrl,
    verifiedText: [
      `Topic: ${topic.name}`,
      `Category: ${topic.category}`,
      `Official URL: ${topic.officialUrl}`,
      `Site description: ${topic.shortDescription}`,
      officialText
        ? `Official page text:\n${officialText.slice(0, MAX_OFFICIAL_TEXT)}`
        : "Official page text: unavailable",
    ].join("\n"),
    limitations,
    sourceReady: sourceAssessment.ready,
    ...(sourceAssessment.reason ? { sourceReason: sourceAssessment.reason } : {}),
  };
}
