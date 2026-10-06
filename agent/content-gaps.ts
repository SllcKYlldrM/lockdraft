import type { AffiliateOpportunity, ContentIntent } from "./growth.config.ts";
import type { GuideType } from "./src/core/types.ts";

export type GapPriority = "P1" | "P2" | "P3";
export type GapStatus = "planned" | "published" | "skipped";
export type GapAction = "CREATE" | "UPDATE EXISTING" | "SKIP";
export type GapShape = "pillar" | "supporting";

export interface ContentGap {
  topic: string;
  cluster: string;
  intent: ContentIntent;
  priority: GapPriority;
  type: GuideType;
  title: string;
  category: "ai-news" | "agents" | "automation" | "tutorials";
  shape: GapShape;
  action: GapAction;
  sourceRequirement: string;
  affiliateOpportunity: AffiliateOpportunity;
  affiliateInfluenceOnPriority: "NONE";
  status: GapStatus;
  rationale: string;
}

/**
 * Bounded editorial backlog. It is deliberately data-only: it does not
 * publish content and affiliate opportunity is never a scoring input.
 * Existing posts were checked before this list was prepared.
 */
export const contentGaps: ContentGap[] = [
  { topic: "mcp", cluster: "MCP & Tool Use", intent: "RESEARCH", priority: "P1", type: "explainer", title: "What Is MCP? Architecture, Clients, Servers, and Permissions", category: "tutorials", shape: "pillar", action: "CREATE", sourceRequirement: "MCP specification and official architecture docs", affiliateOpportunity: "none", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Beginner research pillar is missing; no existing post covers MCP fundamentals as an explainer." },
  { topic: "rag", cluster: "RAG & Vector Search", intent: "RESEARCH", priority: "P1", type: "explainer", title: "What Is RAG? Retrieval, Grounding, and the Vector Search Pipeline", category: "tutorials", shape: "pillar", action: "CREATE", sourceRequirement: "LlamaIndex or equivalent official RAG documentation plus primary references", affiliateOpportunity: "none", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Existing RAG registration has no article; this is a high-value beginner research gap." },
  { topic: "ai-agents", cluster: "Agent Architecture & Memory", intent: "RESEARCH", priority: "P1", type: "explainer", title: "How Do AI Agents Work? Planning, Tools, State, and Memory", category: "agents", shape: "pillar", action: "CREATE", sourceRequirement: "Official agent/tool-use docs and primary architecture sources", affiliateOpportunity: "none", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Agents has comparison coverage but lacks a durable architecture primer." },
  { topic: "open-source-llms", cluster: "Local AI / Local LLM", intent: "RESEARCH", priority: "P1", type: "explainer", title: "What Is a Local LLM? Inference, GGUF, Quantization, and Hardware Fit", category: "tutorials", shape: "pillar", action: "CREATE", sourceRequirement: "Ollama, llama.cpp, and Hugging Face official docs", affiliateOpportunity: "possible", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "News coverage exists, but there is no evergreen local-AI research layer." },
  { topic: "mcp", cluster: "MCP & Tool Use", intent: "EVALUATION", priority: "P1", type: "comparison", title: "MCP Tools, Resources, and Prompts: Choosing the Right Capability", category: "agents", shape: "supporting", action: "CREATE", sourceRequirement: "MCP specification, official concepts docs, and security guidance", affiliateOpportunity: "none", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Follows the MCP pillar with a real decision and trade-off question." },
  { topic: "rag", cluster: "RAG & Vector Search", intent: "EVALUATION", priority: "P1", type: "comparison", title: "RAG Retrieval Choices: Vector, Hybrid, and Reranked Search", category: "tutorials", shape: "supporting", action: "CREATE", sourceRequirement: "Official vector database/retrieval docs and primary research", affiliateOpportunity: "possible", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Avoids generic tool lists and compares retrieval strategies by use case." },
  { topic: "open-source-llms", cluster: "Local AI / Local LLM", intent: "EVALUATION", priority: "P1", type: "comparison", title: "Ollama vs Transformers vs GGUF Workflows for Local Inference", category: "tutorials", shape: "supporting", action: "CREATE", sourceRequirement: "Official runtime docs, verified setup steps, and reproducible hardware notes", affiliateOpportunity: "possible", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "The current news posts do not provide a runtime decision framework." },
  { topic: "ai-agents", cluster: "Agent Architecture & Memory", intent: "EVALUATION", priority: "P1", type: "comparison", title: "ReAct vs Plan-and-Execute: When Each Agent Control Pattern Fits", category: "agents", shape: "supporting", action: "UPDATE EXISTING", sourceRequirement: "Existing ReAct article plus primary/official framework documentation", affiliateOpportunity: "none", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Existing article covers this intent; improve it instead of creating a duplicate URL." },
  { topic: "n8n", cluster: "AI Automation Platforms", intent: "RESEARCH", priority: "P1", type: "workflow-recipe", title: "Reliable n8n Agent Workflows: Retries, Observability, and Recovery", category: "automation", shape: "pillar", action: "CREATE", sourceRequirement: "n8n official docs for error handling, retries, webhooks, and agents", affiliateOpportunity: "possible", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "The existing n8n articles lack an operational reliability layer." },
  { topic: "prompt-engineering", cluster: "Evaluation & Observability", intent: "EVALUATION", priority: "P1", type: "tutorial", title: "Prompt Evaluation and Regression Testing for Production Systems", category: "tutorials", shape: "supporting", action: "CREATE", sourceRequirement: "Official eval documentation and primary evaluation guidance", affiliateOpportunity: "none", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Prompt basics exist; production evaluation is the missing next-stage intent." },
  { topic: "openai", cluster: "AI Fundamentals for Practitioners", intent: "RESEARCH", priority: "P2", type: "tutorial", title: "Structured Output and Tool Calling: Reliable Model-to-Code Boundaries", category: "tutorials", shape: "supporting", action: "CREATE", sourceRequirement: "Official OpenAI, Anthropic, or Gemini structured-output/tool docs", affiliateOpportunity: "none", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "A cross-provider practitioner concept is missing and is not tied to a product sale." },
  { topic: "mcp", cluster: "MCP & Tool Use", intent: "EVALUATION", priority: "P2", type: "tutorial", title: "MCP Security Boundaries: Permissions, Tool Trust, and Data Exposure", category: "agents", shape: "supporting", action: "CREATE", sourceRequirement: "MCP security documentation and official client/server guidance", affiliateOpportunity: "none", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Security is a necessary companion to the MCP beginner layer." },
  { topic: "open-source-llms", cluster: "Local AI / Local LLM", intent: "COMMERCIAL_ASSISTANCE", priority: "P2", type: "comparison", title: "Local vs Hosted Inference: Cost, Privacy, Latency, and Maintenance", category: "tutorials", shape: "supporting", action: "CREATE", sourceRequirement: "Provider pricing, privacy docs, runtime docs, and reproducible cost assumptions", affiliateOpportunity: "strong", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Commercial assistance is useful only as a neutral decision framework; affiliate status cannot promote it." },
  { topic: "n8n", cluster: "AI Automation Platforms", intent: "EVALUATION", priority: "P2", type: "comparison", title: "n8n vs Make vs Zapier for AI Workflows: Setup, Limits, and Portability", category: "automation", shape: "supporting", action: "CREATE", sourceRequirement: "Official pricing, docs, privacy terms, and transparent test criteria", affiliateOpportunity: "strong", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Comparison is justified by a concrete workflow choice, not by affiliate availability." },
  { topic: "openai", cluster: "AI API Cost & Usage", intent: "COMMERCIAL_ASSISTANCE", priority: "P2", type: "explainer", title: "AI API Cost Basics: Tokens, Caching, Batching, and Context Control", category: "automation", shape: "supporting", action: "CREATE", sourceRequirement: "Official provider pricing and usage documentation", affiliateOpportunity: "possible", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Cost literacy helps readers regardless of provider or affiliate relationship." },
  { topic: "claude-code", cluster: "AI Coding Tools", intent: "EVALUATION", priority: "P2", type: "comparison", title: "AI Coding Agent Workflows: Choosing by Repo Risk, Control, and Portability", category: "agents", shape: "supporting", action: "CREATE", sourceRequirement: "Official docs for each named tool; no unverified hands-on claims", affiliateOpportunity: "strong", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Compare workflow fit and lock-in, not a fabricated universal winner." },
  { topic: "ai-agents", cluster: "Evaluation & Observability", intent: "RESEARCH", priority: "P2", type: "troubleshooting", title: "Measuring Agent Reliability: Traces, Evals, Hallucinations, and Regressions", category: "agents", shape: "supporting", action: "CREATE", sourceRequirement: "Official observability/eval docs and primary measurement references", affiliateOpportunity: "possible", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Turns agent architecture into an observable, testable practice." },
  { topic: "open-source-llms", cluster: "Model Selection & Benchmarks", intent: "EVALUATION", priority: "P2", type: "comparison", title: "Reading AI Model Benchmarks: Context, Latency, Cost, and Task Fit", category: "tutorials", shape: "supporting", action: "CREATE", sourceRequirement: "Model cards, benchmark methodology, and official pricing where applicable", affiliateOpportunity: "none", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Builds reader judgment rather than repeating release claims." },
  { topic: "ai-agents", cluster: "Agent Architecture & Memory", intent: "RESEARCH", priority: "P2", type: "explainer", title: "Agent Memory Explained: Conversation State, Long-Term Storage, and Failure Modes", category: "agents", shape: "supporting", action: "CREATE", sourceRequirement: "Official framework memory docs and primary architecture sources", affiliateOpportunity: "possible", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "Memory is a named cluster gap with practical architectural consequences." },
  { topic: "rag", cluster: "RAG & Vector Search", intent: "EVALUATION", priority: "P2", type: "troubleshooting", title: "RAG Failure Modes: Retrieval Checks, Citations, and Fallback Behavior", category: "tutorials", shape: "supporting", action: "CREATE", sourceRequirement: "Official retrieval docs plus reproducible failure examples", affiliateOpportunity: "possible", affiliateInfluenceOnPriority: "NONE", status: "planned", rationale: "A failure-oriented guide is more useful than another generic RAG overview." },
];

const priorityRank: Record<GapPriority, number> = { P1: 0, P2: 1, P3: 2 };

export function gapFor(topic: string | undefined, guideType: GuideType): ContentGap | undefined {
  return contentGaps.find(
    (gap) => gap.status === "planned" && gap.topic === topic && gap.type === guideType && gap.action !== "SKIP",
  );
}

export function compareGapPriority(left?: ContentGap, right?: ContentGap): number {
  if (left && right) return priorityRank[left.priority] - priorityRank[right.priority];
  if (left) return -1;
  if (right) return 1;
  return 0;
}
