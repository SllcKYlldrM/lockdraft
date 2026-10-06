/**
 * Optional future measurement inputs. These stay empty until real exports or
 * an approved API adapter supplies them; no synthetic traffic data belongs in
 * the growth decision path.
 */
export interface SearchConsoleSignal {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  page: string;
}

export interface Ga4Signal {
  event: "article_view" | "article_50_percent" | "article_90_percent" | "related_article_click" | "source_click" | "site_search" | "prompt_copy";
  page?: string;
  query?: string;
  count: number;
}

export interface GrowthSignals {
  searchConsole: SearchConsoleSignal[];
  ga4: Ga4Signal[];
}

export type ContentIntent = "RESEARCH" | "EVALUATION" | "COMMERCIAL_ASSISTANCE";
export type AffiliateOpportunity = "none" | "possible" | "strong";

export interface TopicCluster {
  id: string;
  name: string;
  scope: string[];
  preferredCategories: string[];
}

/**
 * Closed growth vocabulary. Clusters are planning metadata, not new site
 * categories; publication still routes through the four existing categories.
 */
export const topicClusters: TopicCluster[] = [
  { id: "ai-fundamentals", name: "AI Fundamentals for Practitioners", scope: ["embeddings", "context windows", "tokens", "structured outputs", "inference", "quantization", "tool calling"], preferredCategories: ["tutorials", "agents"] },
  { id: "mcp-tool-use", name: "MCP & Tool Use", scope: ["MCP architecture", "clients", "servers", "permissions", "tools/resources/prompts", "security"], preferredCategories: ["tutorials", "agents"] },
  { id: "rag-vector-search", name: "RAG & Vector Search", scope: ["embeddings", "retrieval", "chunking", "vector databases", "hybrid search", "reranking"], preferredCategories: ["tutorials", "agents"] },
  { id: "local-ai", name: "Local AI / Local LLM", scope: ["Ollama", "llama.cpp", "LM Studio", "vLLM", "GGUF", "hardware"], preferredCategories: ["tutorials", "ai-news"] },
  { id: "ai-coding-tools", name: "AI Coding Tools", scope: ["Claude Code", "Codex", "Cursor", "Cline", "Continue", "Copilot", "coding agent workflows"], preferredCategories: ["agents", "tutorials"] },
  { id: "ai-automation", name: "AI Automation Platforms", scope: ["n8n", "Make", "Zapier", "workflow design", "webhooks", "integrations"], preferredCategories: ["automation", "tutorials"] },
  { id: "model-selection", name: "Model Selection & Benchmarks", scope: ["benchmarks", "context", "latency", "cost", "reasoning", "coding", "multimodal"], preferredCategories: ["tutorials", "ai-news"] },
  { id: "api-cost", name: "AI API Cost & Usage", scope: ["token pricing", "caching", "batching", "context optimization", "provider trade-offs"], preferredCategories: ["tutorials", "automation"] },
  { id: "agent-architecture", name: "Agent Architecture & Memory", scope: ["memory", "planning", "tool use", "orchestration", "multi-agent systems", "state management"], preferredCategories: ["agents", "tutorials"] },
  { id: "evaluation-observability", name: "Evaluation & Observability", scope: ["evals", "tracing", "prompt testing", "monitoring", "hallucination measurement", "regression testing"], preferredCategories: ["agents", "automation", "tutorials"] },
];

export const contentIntents: Record<ContentIntent, string[]> = {
  RESEARCH: ["what is", "explained", "beginner guide", "how it works", "terminology", "architecture basics"],
  EVALUATION: ["vs", "comparison", "when to use", "trade-offs", "alternatives", "migration considerations"],
  COMMERCIAL_ASSISTANCE: ["tool selection", "hosting/provider choice", "cost comparison", "workflow/tool recommendation"],
};

export const commercialSafeguards = {
  affiliateInfluenceOnPriority: "NONE",
  monetizationDeterminesPublication: false,
  requireDisclosure: true,
  requireEditorialIndependence: true,
  allowPayForRanking: false,
  allowUnverifiedExperienceClaims: false,
  allowGenericAffiliateFiller: false,
  allowIntrusiveMonetization: false,
} as const;

export const priorityOrder = [
  "missing pillar",
  "beginner research gap",
  "strong supporting evergreen",
  "meaningful comparison/evaluation",
  "meaningful news/release",
  "commercial-assistance article",
  "minor release / low-value commercial content",
] as const;

export const growthSignals: GrowthSignals = {
  searchConsole: [],
  ga4: [],
};

export const growthWeights = {
  clusterGap: 30,
  pillarSupport: 20,
  evergreenValue: 20,
  userUsefulness: 15,
  sourceAvailability: 10,
  freshnessValue: 5,
  overlapRiskPenalty: 25,
} as const;
