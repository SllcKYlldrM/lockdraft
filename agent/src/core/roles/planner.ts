import { callLLM } from "../llm/provider.ts";
import { extractJson } from "../llm/json.ts";
import { limits } from "../../../agent.config.ts";
import type {
  SourceItem,
  NewsCandidate,
  NewsType,
  GuideCandidate,
  GuideBrief,
  GuideType,
} from "../types.ts";
import type {
  TopicDefinition,
  CategoryDefinition,
  ExistingPost,
} from "../../adapters/site-context.ts";

const NEWS_TYPES: NewsType[] = [
  "model-release",
  "tool-update",
  "research",
  "industry",
  "security",
];

/**
 * Scores and classifies news candidates in a single LLM call. Falls back
 * to a small heuristic (recency + keyword hits) if the LLM call fails
 * entirely, so a provider outage doesn't stall the whole run.
 */
export async function planNews(
  items: SourceItem[],
): Promise<NewsCandidate[]> {
  if (items.length === 0) return [];

  const listing = items
    .map(
      (item, i) =>
        `${i}. [${item.kind}] "${item.title}" (topic: ${item.topic ?? "none"}, source: ${item.sourceName}, published: ${item.publishedAt})\n   ${item.summary.slice(0, 300)}`,
    )
    .join("\n");

  const prompt = `You are a selective AI/automation news editor. This site
only publishes a small number of articles per day, so be strict — most
items should score below the bar. Score each item 0-100 for how much a
developer or automation practitioner who follows AI tooling needs to know
about it right now:

90-100: major — a new flagship model release, a significant API/pricing
        change from a major lab, a widely-used tool (n8n, LangChain,
        Claude Code, Cursor, MCP) shipping a breaking or headline feature,
        a real security disclosure affecting AI tooling.
75-89:  solid — a meaningful model/tool update with concrete new
        capabilities, a genuine research result with practical
        implications, a notable open-source model release.
Below 75: skip — minor version bumps with no user-facing change, routine
        bugfix releases, marketing/partnership announcements with no
        technical substance, "thought leadership" opinion pieces, generic
        listicles, sponsored content, or anything that's essentially an ad
        rather than news a practitioner needs to act on.

When in doubt, score it low — a missed minor item costs nothing; a
published item that's really just an ad or a trivial bump costs the
site's credibility.

Classify each into exactly one newsType: model-release, tool-update,
research, industry, security.

Items:
${listing}

Respond with ONLY a JSON array, one object per item, in the same order:
[{"index": 0, "score": 85, "newsType": "model-release", "reason": "one short sentence"}, ...]`;

  try {
    const response = await callLLM("planner", [
      { role: "system", content: "You output only valid JSON, no prose." },
      { role: "user", content: prompt },
    ]);
    const parsed = extractJson<
      { index: number; score: number; newsType: string; reason: string }[]
    >(response);

    const candidates: NewsCandidate[] = [];
    for (const entry of parsed) {
      const item = items[entry.index];
      if (!item) continue;
      const newsType = NEWS_TYPES.includes(entry.newsType as NewsType)
        ? (entry.newsType as NewsType)
        : "industry";
      candidates.push({
        item,
        score: Math.max(0, Math.min(100, entry.score)),
        newsType,
        reason: entry.reason ?? "",
      });
    }
    return candidates
      .filter((c) => c.score >= limits.newsScoreThreshold)
      .sort((a, b) => b.score - a.score);
  } catch {
    return heuristicScore(items);
  }
}

/**
 * Breaking candidates bypass the normal spacing window when they are both
 * high-scoring and very recent from a source we treat as official/first-party.
 */
export function isBreakingNewsCandidate(candidate: NewsCandidate): boolean {
  const ageHours =
    (Date.now() - new Date(candidate.item.publishedAt).getTime()) / 3_600_000;
  const firstPartySource = ["rss", "github-release"].includes(candidate.item.kind);
  return candidate.score >= 90 && ageHours >= 0 && ageHours <= 24 && firstPartySource;
}

const HIGH_SIGNAL_RE =
  /release[ds]?|launch(es|ed)?|announc|api\b|deprecat|breaking change|open.?source|benchmark|vulnerab|cve-|security|price|pricing|context window|fine-?tun/i;
// Marketing/partnership/hiring posts and routine patch bumps — score these
// down even if they also happen to mention "release"/"update".
const LOW_SIGNAL_RE =
  /\b(webinar|hiring|we're hiring|sponsored|partnership announcement|case study|patch release v?\d+\.\d+\.\d+$|maintenance release)\b/i;

function heuristicScore(items: SourceItem[]): NewsCandidate[] {
  return items
    .map((item): NewsCandidate => {
      const hoursAgo =
        (Date.now() - new Date(item.publishedAt).getTime()) / 3_600_000;
      const recency = Math.max(0, 40 - hoursAgo);
      const signal = LOW_SIGNAL_RE.test(item.title)
        ? 0
        : HIGH_SIGNAL_RE.test(item.title)
          ? 40
          : 10;
      const official = item.kind === "rss" || item.kind === "github-release" ? 20 : 5;
      return {
        item,
        score: Math.round(recency + signal + official),
        newsType: item.kind === "github-release" ? "tool-update" : "industry",
        reason: "heuristic fallback (planner LLM unavailable)",
      };
    })
    .filter((c) => c.score >= limits.newsScoreThreshold)
    .sort((a, b) => b.score - a.score);
}

const GUIDE_TYPES: GuideType[] = [
  "tutorial",
  "explainer",
  "comparison",
  "workflow-recipe",
  "troubleshooting",
];

/**
 * Returns guide candidates in coverage order. Source readiness is checked
 * after this stage, before Writer is called, so a weak first candidate can
 * be skipped without spending a writing/editor request.
 */
export function planGuideCandidates(
  topicsList: TopicDefinition[],
  categoriesList: CategoryDefinition[],
  existingPosts: ExistingPost[],
): GuideCandidate[] {
  const guidePosts = existingPosts.filter((p) => p.kind === "guides");

  const categoryCounts = new Map<string, number>();
  for (const cat of categoriesList) categoryCounts.set(cat.id, 0);
  for (const post of guidePosts) {
    if (post.category) {
      categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1);
    }
  }
  const sortedCategories = [...categoriesList].sort(
    (a, b) => (categoryCounts.get(a.id) ?? 0) - (categoryCounts.get(b.id) ?? 0),
  );

  const candidates: GuideCandidate[] = [];
  for (const category of sortedCategories) {
    const topicsInCategory = topicsList.filter((t) => t.category === category.id);
    for (const topic of topicsInCategory) {
      const covered = new Set(
        guidePosts.filter((p) => p.topic === topic.id).map((p) => p.guideType),
      );
      const missing = GUIDE_TYPES.find((t) => !covered.has(t));
      if (missing) {
        candidates.push({
          topic: topic.id,
          category: category.id,
          guideType: missing,
          relatedGuideSlugs: guidePosts
            .filter((p) => p.topic === topic.id)
            .map((p) => p.slug)
            .slice(0, 3),
        });
      }
    }
  }
  return candidates;
}

/** Creates the brief only after the pipeline has approved the source. */
export function createGuideBrief(
  candidate: GuideCandidate,
  topic: TopicDefinition | undefined,
  category: CategoryDefinition | undefined,
): GuideBrief {
  const topicName = topic?.name ?? candidate.topic ?? "the topic";
  const categoryName = category?.name ?? candidate.category;
  return {
    ...candidate,
    workingTitle: `${topicName}: ${candidate.guideType} guide`,
    angle: `A ${candidate.guideType} guide for ${topicName}, filling a gap in current ${categoryName} coverage.`,
  };
}

/** Backwards-compatible single-candidate planner for local tooling. */
export function planGuide(
  topicsList: TopicDefinition[],
  categoriesList: CategoryDefinition[],
  existingPosts: ExistingPost[],
): GuideBrief | undefined {
  const candidate = planGuideCandidates(topicsList, categoriesList, existingPosts)[0];
  return candidate
    ? createGuideBrief(
        candidate,
        topicsList.find((topic) => topic.id === candidate.topic),
        categoriesList.find((category) => category.id === candidate.category),
      )
    : undefined;
}
