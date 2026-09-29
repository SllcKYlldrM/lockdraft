import type { ContentGap } from "../../../content-gaps.ts";
import { growthSignals, growthWeights, type GrowthSignals } from "../../../growth.config.ts";
import type { Article, GuideCandidate, SourceItem } from "../types.ts";
import type { ExistingPost } from "../../adapters/site-context.ts";
import { findPostOverlap } from "../../adapters/site-context.ts";
import { hasSourcesSection } from "./editorial.ts";

export type GrowthDecision = "CREATE" | "UPDATE EXISTING" | "SKIP";
export type FreshnessStatus = "fresh" | "monitor" | "update_candidate";

export interface GrowthDecisionResult {
  decision: GrowthDecision;
  reason: string;
  existingSlug?: string;
}

export interface GrowthScore {
  total: number;
  band: "HIGH" | "MEDIUM" | "LOW";
  clusterGap: number;
  pillarSupport: number;
  evergreenValue: number;
  userUsefulness: number;
  sourceAvailability: number;
  freshnessValue: number;
  overlapRisk: number;
}

export interface FreshnessItem {
  slug: string;
  status: FreshnessStatus;
  published: string;
  updated?: string;
}

const DAY_MS = 86_400_000;

export function scoreContentGap(
  gap: ContentGap,
  signals: GrowthSignals = growthSignals,
): GrowthScore {
  const clusterGap = gap.priority === "P1" ? growthWeights.clusterGap : gap.priority === "P2" ? 20 : 10;
  const pillarSupport = gap.type === "tutorial" || gap.type === "workflow-recipe"
    ? growthWeights.pillarSupport
    : 12;
  const evergreenValue = gap.type === "comparison" || gap.type === "explainer"
    ? growthWeights.evergreenValue
    : 15;
  const userUsefulness = /implementation|troubleshooting|workflow|evaluation/i.test(gap.intent)
    ? growthWeights.userUsefulness
    : 8;
  const sourceAvailability = signals.searchConsole.length > 0 || signals.ga4.length > 0
    ? growthWeights.sourceAvailability
    : 5;
  const freshnessValue = gap.priority === "P1" ? growthWeights.freshnessValue : 3;
  const overlapRisk = 0;
  const total = clusterGap + pillarSupport + evergreenValue + userUsefulness + sourceAvailability + freshnessValue - overlapRisk;
  return {
    total,
    band: total >= 80 ? "HIGH" : total >= 55 ? "MEDIUM" : "LOW",
    clusterGap,
    pillarSupport,
    evergreenValue,
    userUsefulness,
    sourceAvailability,
    freshnessValue,
    overlapRisk,
  };
}

export function decideNewsCandidate(
  item: SourceItem,
  existingPosts: ExistingPost[],
): GrowthDecisionResult {
  if (!item.sourceUrl?.trim()) {
    return { decision: "SKIP", reason: "verified primary source URL is missing" };
  }
  const overlap = findPostOverlap(item.title, item.sourceUrl, existingPosts);
  if (overlap) {
    return {
      decision: "UPDATE EXISTING",
      reason: "source or title overlaps an existing article; manual update review required",
      existingSlug: overlap.slug,
    };
  }
  if (/\b(patch|bugfix|maintenance|release notes|minor)\b/i.test(item.title)) {
    return {
      decision: "SKIP",
      reason: "routine release pattern without a separate user intent",
    };
  }
  return { decision: "CREATE", reason: "unique source, intent, and practical news value" };
}

export function decideGuideCandidate(
  candidate: GuideCandidate,
): GrowthDecisionResult {
  if (!candidate.gap) {
    return { decision: "SKIP", reason: "candidate is not backed by the approved content-gap backlog" };
  }
  return { decision: "CREATE", reason: `approved ${candidate.gap.priority} evergreen gap: ${candidate.gap.title}` };
}

export function evaluatePublishGate(
  article: Article,
  sourceText: string,
  overlapRatio: number,
  internalLinkCount: number,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (article.frontmatter.draft) errors.push("draft frontmatter cannot be published");
  if (!article.frontmatter.category) errors.push("category is missing");
  if (article.frontmatter.tags.length === 0) errors.push("taxonomy is empty");
  if (article.kind === "news" && !article.frontmatter.sourceUrl) errors.push("news source is missing");
  if (!sourceText.trim()) errors.push("source text is empty");
  if (!hasSourcesSection(article.body)) errors.push("Sources or References section is missing");
  if (overlapRatio > 0.15) errors.push(`source overlap ${overlapRatio.toFixed(2)} exceeds limit`);
  // Zero candidates is acceptable when the cluster has no natural neighbour;
  // it is still evaluated explicitly rather than silently ignored.
  if (internalLinkCount < 0) errors.push("internal-link evaluation failed");
  return { valid: errors.length === 0, errors };
}

export function buildFreshnessQueue(posts: ExistingPost[], now = Date.now()): FreshnessItem[] {
  return posts
    .filter((post) => post.sourceLink || post.tags.some((tag) => /sdk|model|tool-update|ai-news/i.test(tag)))
    .map((post) => {
      const date = new Date(post.updated ?? post.published).getTime();
      const age = Number.isFinite(date) ? now - date : Infinity;
      const status: FreshnessStatus = age <= 30 * DAY_MS
        ? "fresh"
        : age <= 90 * DAY_MS
          ? "monitor"
          : "update_candidate";
      return { slug: post.slug, status, published: post.published, updated: post.updated };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}
