// Single place to tune the agent without touching pipeline code.
// OpenRouter fallback models are pinned to low-cost, text-capable models so
// a Gemini quota outage cannot silently route a short article to a premium
// model. Keep the ids verified against OpenRouter's current model catalog.
//
// This site shares Gemini/OpenRouter API keys with the Metarotation agent
// (Metarotasyon/meta-claude/metarotation/agent), so free-tier quota is
// shared between the two sites — see the news cron offset below.
import { fileURLToPath } from "node:url";

const geminiTextModel = process.env.LOCKDRAFT_GEMINI_TEXT_MODEL ?? "gemini-3.6-flash";

// Planner uses Gemini Flash-Lite for better briefs at low cost. Writer/editor use Gemini text as the quality-first primary
// when GEMINI_API_KEY is available, with OpenRouter fallbacks. Gemini is
// also used for the required artist role.
export const modelConfig = {
  planner: {
    primary: { provider: "gemini", model: "gemini-3.5-flash-lite" },
    fallback: { provider: "gemini", model: "gemini-3.6-flash" },
    emergencyFallback: { provider: "openrouter", model: "qwen/qwen3.7-flash" },
    lastResortFallback: { provider: "openrouter", model: "deepseek/deepseek-v4-flash" },
  },
  writer: {
    primary: { provider: "gemini", model: geminiTextModel },
    fallback: { provider: "gemini", model: "gemini-3.5-flash" },
    emergencyFallback: { provider: "openrouter", model: "qwen/qwen3.7-flash" },
    lastResortFallback: { provider: "openrouter", model: "deepseek/deepseek-v4-flash" },
  },
  editor: {
    primary: { provider: "gemini", model: geminiTextModel },
    fallback: { provider: "gemini", model: "gemini-3.5-flash" },
    emergencyFallback: { provider: "openrouter", model: "qwen/qwen3.7-flash" },
    lastResortFallback: { provider: "openrouter", model: "deepseek/deepseek-v4-flash" },
    guideQuality: { provider: "gemini", model: "gemini-3.1-pro-preview" },
  },
  artist: {
    primary: { provider: "gemini", model: "gemini-3.1-flash-image" },
    fallback: undefined,
  },
} as const;

export const limits = {
  /** Max news articles published per UTC calendar day. Kept low since the
   * Gemini/OpenRouter quota is shared with the Metarotation agent. */
  maxNewsPerDay: 2,
  /** Publish at most one news article per workflow run. */
  maxNewsPerRun: 1,
  /** Minimum gap between successful news runs that publish content. */
  minHoursBetweenNews: 6,
  /** Minimum planner score (0-100) for a candidate to be written up. */
  newsScoreThreshold: 75,
  /** Only consider source items published within this window. Mirrors the
   * Metarotation agent's reasoning: a strict score threshold combined with
   * a short window can let a batch of announcements (a keynote, a model
   * launch with several follow-up posts) age out before enough of them
   * clear the bar to use the daily quota. seen.json prevents
   * republishing, while rejected sources use a temporary cooldown so they
   * can be reconsidered after a better run. */
  newsLookbackHours: 24 * 7,
  /** Editor revise attempts before an article is rejected. */
  maxRevisions: 2,
  /** Hours before an editor-rejected source may be reconsidered. */
  rejectionRetryHours: 24,
  /** Body/source 8-gram overlap ratio above which we force a revision. */
  maxOverlapRatio: 0.15,
  /** News body word count floor — catches thin filler the LLM editor
   * sometimes lets through. */
  minNewsWords: 300,
  /** Guide floors are tuned by format so short explainers are not padded. */
  minGuideWordsByType: {
    tutorial: 1000,
    explainer: 900,
    "workflow-recipe": 1000,
    comparison: 1200,
    troubleshooting: 800,
  },
  minGuideTablesByType: {
    tutorial: 1,
    explainer: 1,
    "workflow-recipe": 1,
    comparison: 2,
    troubleshooting: 1,
  },
  /** Higher-risk guide formats get a second, deeper Gemini review. */
  deepReviewGuideTypes: ["comparison", "workflow-recipe"] as const,
  /** LLM call retry attempts (per model) on 429/404/5xx before falling back. */
  llmRetries: 3,
  /** Minimum characters a YouTube item's description needs before we'll
   * write an article from it. We only ever have the title + description
   * (no transcript — see article-fetcher.ts), so a thin description gives
   * the writer LLM nothing to work from except invented specifics. Below
   * this, skip writing entirely rather than risk that. */
  minYoutubeSourceChars: 200,
} as const;

// Every URL below verified reachable (HTTP 200, RSS/XML content-type) on
// 2026-09-24. Anthropic has no public RSS feed for /news — covered instead
// via the anthropics/claude-code GitHub releases feed below. Re-check any
// dead feed before re-adding rather than leaving it silently broken.
export const rssSources: { topic?: string; url: string; name: string }[] = [
  { topic: "openai", url: "https://openai.com/news/rss.xml", name: "OpenAI" },
  { topic: "gemini", url: "https://blog.google/technology/ai/rss/", name: "Google AI Blog" },
  { topic: "open-source-llms", url: "https://huggingface.co/blog/feed.xml", name: "Hugging Face Blog" },
  { topic: "n8n", url: "https://blog.n8n.io/feed/", name: "n8n Blog" },
];

// GitHub Releases (unauthenticated: 60 req/hour, well within a 2-hourly
// cron's needs). Covers tools with no reliable blog RSS, and gives
// version-accurate release notes the writer can quote precisely.
export const githubReleaseSources: { topic?: string; repo: string; name: string }[] = [
  { topic: "claude-code", repo: "anthropics/claude-code", name: "Claude Code" },
  { topic: "n8n", repo: "n8n-io/n8n", name: "n8n" },
  { topic: "ai-agents", repo: "langchain-ai/langchain", name: "LangChain" },
  { topic: "open-source-llms", repo: "ollama/ollama", name: "Ollama" },
  { topic: "openai", repo: "openai/openai-python", name: "OpenAI Python SDK" },
];

// Hacker News via the unauthenticated Algolia search API — used as a
// cross-topic industry-signal source, filtered by points in the adapter.
export const hackerNewsSources: { query: string; minPoints: number }[] = [
  { query: "AI agent", minPoints: 150 },
  { query: "LLM", minPoints: 150 },
  { query: "Claude OR GPT OR Gemini", minPoints: 200 },
];

export const redditSources: { topic: string; subreddit: string }[] = [
  { topic: "open-source-llms", subreddit: "LocalLLaMA" },
  { topic: "n8n", subreddit: "n8n" },
  { topic: "ai-agents", subreddit: "AI_Agents" },
];

export const youtubeSources: { topic?: string; channelId: string; name: string }[] = [];

export const stateDir = fileURLToPath(new URL("./state/", import.meta.url));
export const sitePath = fileURLToPath(new URL("../", import.meta.url)); // lockdraft/
