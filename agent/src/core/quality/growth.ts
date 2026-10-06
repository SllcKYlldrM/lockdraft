import type { ContentGap } from "../../../content-gaps.ts";
import { growthSignals, growthWeights, type GrowthSignals } from "../../../growth.config.ts";
import { limits } from "../../../agent.config.ts";
import type { Article, GuideCandidate, PromptArticle, PromptReference, SourceItem } from "../types.ts";
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
  if (candidate.gap.action === "SKIP") {
    return { decision: "SKIP", reason: "backlog explicitly skips this low-value or overlapping intent" };
  }
  if (candidate.gap.action === "UPDATE EXISTING") {
    return { decision: "UPDATE EXISTING", reason: "backlog maps this intent to an existing article; no new URL should be created" };
  }
  return { decision: "CREATE", reason: `approved ${candidate.gap.priority} evergreen gap: ${candidate.gap.title}` };
}

function purposeTokens(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/\{\{[^}]+\}\}/g, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((token) =>
        token.length > 2 &&
        !["the", "and", "for", "with", "this", "that", "analyze", "create", "explain", "find", "help", "identify", "review", "use"].includes(token)
      ),
  );
}

function tokenOverlap(left: string, right: string): number {
  const a = purposeTokens(left);
  const b = purposeTokens(right);
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection++;
  return intersection / Math.min(a.size, b.size);
}

export function decidePromptArticle(
  article: PromptArticle,
  existingPrompts: PromptReference[],
): GrowthDecisionResult {
  const exact = existingPrompts.find(
    (prompt) => prompt.slug === article.frontmatter.slug ||
      prompt.title.trim().toLowerCase() === article.frontmatter.title.trim().toLowerCase(),
  );
  if (exact) {
    return {
      decision: "SKIP",
      reason: `prompt purpose or slug already exists (${exact.slug})`,
      existingSlug: exact.slug,
    };
  }

  for (const prompt of existingPrompts) {
    const titleOverlap = tokenOverlap(article.frontmatter.title, prompt.title);
    const purposeOverlap = tokenOverlap(article.promptTemplate, prompt.promptTemplate);
    if (titleOverlap >= 0.8 || purposeOverlap >= 0.8) {
      return {
        decision: "SKIP",
        reason: `prompt purpose is too close to existing prompt (${prompt.slug})`,
        existingSlug: prompt.slug,
      };
    }
    if (titleOverlap >= 0.55 || purposeOverlap >= 0.65) {
      return {
        decision: "UPDATE EXISTING",
        reason: `existing prompt may be meaningfully improvable (${prompt.slug}); manual review required`,
        existingSlug: prompt.slug,
      };
    }
  }

  return { decision: "CREATE", reason: "unique reusable prompt intent" };
}

export function evaluatePublishGate(
  article: Article,
  sourceText: string,
  overlapRatio: number,
  internalLinkCount: number,
  maxOverlapRatio: number = limits.maxOverlapRatio,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (article.frontmatter.draft) errors.push("draft frontmatter cannot be published");
  if (!article.frontmatter.category) errors.push("category is missing");
  if (article.frontmatter.tags.length === 0) errors.push("taxonomy is empty");
  if (article.kind === "news" && !article.frontmatter.sourceUrl) errors.push("news source is missing");
  if (!sourceText.trim()) errors.push("source text is empty");
  if (!hasSourcesSection(article.body)) errors.push("Sources or References section is missing");
  if (overlapRatio > maxOverlapRatio) errors.push(`source overlap ${overlapRatio.toFixed(2)} exceeds limit`);
  if (!Number.isInteger(internalLinkCount) || internalLinkCount < 0) {
    errors.push("internal-link evaluation failed");
  }
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
