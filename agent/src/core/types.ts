// Core types shared across the agent pipeline. This file has zero
// dependencies on the LockDraft site — it is the contract between
// core/ (portable) and adapters/ (site-specific).

export type Role = "planner" | "writer" | "editor" | "artist";

export type SourceKind =
  | "rss"
  | "youtube"
  | "github-release"
  | "hackernews"
  | "reddit";

/** A raw item pulled from an external source, before any LLM touches it. */
export interface SourceItem {
  /** Stable id used for seen.json dedupe, e.g. `github-release:n8n-io/n8n:v1.2.3`. */
  id: string;
  /** Topic id from topics.ts, or undefined for cross-topic industry news. */
  topic?: string;
  kind: SourceKind;
  sourceName: string;
  sourceUrl: string;
  title: string;
  summary: string;
  publishedAt: string; // ISO 8601
  /** Provider-specific payload, kept for the writer's prompt context. */
  raw?: unknown;
}

export type NewsType =
  | "model-release"
  | "tool-update"
  | "research"
  | "industry"
  | "security";

export type GuideType =
  | "tutorial"
  | "explainer"
  | "comparison"
  | "workflow-recipe"
  | "troubleshooting";

/** A scored candidate the planner selected for the writer. */
export interface NewsCandidate {
  item: SourceItem;
  score: number; // 0-100
  newsType: NewsType;
  reason: string;
}

export interface GuideCandidate {
  topic?: string;
  category: string;
  guideType: GuideType;
  relatedGuideSlugs: string[];
}

export interface GuideBrief extends GuideCandidate {
  workingTitle: string;
  angle: string;
}

export interface GuideFactPack {
  topicName: string;
  topicId: string;
  category: string;
  officialUrl: string;
  verifiedText: string;
  limitations: string[];
  sourceReady: boolean;
  sourceReason?: string;
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  category: string;
  topic?: string;
  tags: string[];
  cover?: string;
  coverAlt?: string;
  published: string; // ISO 8601
  author: string;
  draft: boolean;
  // news-only
  sourceUrl?: string;
  sourceName?: string;
  newsType?: NewsType;
  // guide-only
  guideType?: GuideType;
  relatedGuides?: string[];
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  body: string; // Markdown, no frontmatter block
  kind: "news" | "guides";
}

export type PromptDifficulty = "beginner" | "intermediate" | "advanced";

/** A category/gap the prompt planner picked to fill next. */
export interface PromptCandidate {
  category: string;
  /** Existing prompt titles in this category, passed to the writer so it
   * doesn't propose a near-duplicate. */
  existingTitles: string[];
}

export interface PromptFrontmatter {
  title: string;
  slug: string;
  description: string;
  category: string;
  models: string[];
  tags: string[];
  difficulty: PromptDifficulty;
  published: string; // ISO 8601
  draft: boolean;
}

/**
 * A reusable prompt template for the `prompts` collection — distinct from
 * Article: the "content" is a fill-in-the-blank prompt (frontmatter.prompt)
 * plus a short Markdown body explaining when/how to use it, not a
 * standalone piece of writing.
 */
export interface PromptArticle {
  frontmatter: PromptFrontmatter;
  /** The reusable prompt text itself, with {{placeholder}} fields. */
  promptTemplate: string;
  /** Markdown body: "## When to use this" + "## Tips" sections. */
  body: string;
}

export type EditorStatus = "pass" | "revise" | "reject";

export interface EditorVerdict {
  status: EditorStatus;
  issues: string[];
}

export interface CoverResult {
  /** Absolute path on disk where the cover was written, if any. */
  filePath?: string;
  /** Site-relative path to store in frontmatter `image`, e.g. /images/posts/x.jpg */
  publicPath?: string;
  alt?: string;
  source: "official" | "ai" | "fallback" | "none";
}

export interface RunSummary {
  runId: string;
  pipeline: "news" | "guide" | "prompt";
  startedAt: string;
  finishedAt: string;
  published: string[]; // slugs
  rejected: { id: string; reason: string }[];
  errors: string[];
  /** Informational notes, e.g. "daily quota exhausted (2/2)" — not errors. */
  notes: string[];
}
