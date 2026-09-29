import type { GuideType } from "./src/core/types.ts";

export type GapPriority = "P1" | "P2" | "P3";
export type GapStatus = "planned" | "published" | "skipped";

export interface ContentGap {
  topic: string;
  cluster: string;
  intent: string;
  priority: GapPriority;
  type: GuideType;
  title: string;
  status: GapStatus;
  rationale: string;
}

// Small editorial backlog, not a topic generator. Every entry must describe a
// missing user intent that can be grounded in the topic's official source.
export const contentGaps: ContentGap[] = [
  {
    topic: "claude-code",
    cluster: "Claude / Anthropic",
    intent: "troubleshooting",
    priority: "P1",
    type: "troubleshooting",
    title: "Claude Code production troubleshooting: sessions, MCP, and gateway failures",
    status: "planned",
    rationale: "Release coverage exists, but there is no evergreen recovery path for recurring session and tool failures.",
  },
  {
    topic: "mcp",
    cluster: "Agents / MCP",
    intent: "implementation",
    priority: "P1",
    type: "tutorial",
    title: "Designing and debugging an MCP server for production tool calls",
    status: "planned",
    rationale: "MCP is present in news and automation posts without a focused implementation and debugging guide.",
  },
  {
    topic: "n8n",
    cluster: "Automation / n8n",
    intent: "workflow reliability",
    priority: "P1",
    type: "workflow-recipe",
    title: "Reliable n8n agent workflows: retries, observability, and failure recovery",
    status: "planned",
    rationale: "The cluster has a first-workflow tutorial and an agents announcement, but no operational reliability layer.",
  },
  {
    topic: "prompt-engineering",
    cluster: "Prompt Engineering",
    intent: "evaluation",
    priority: "P1",
    type: "explainer",
    title: "Prompt evaluation and regression testing for production systems",
    status: "planned",
    rationale: "Prompt basics exist; evaluation and change control are the missing next-stage intent.",
  },
  {
    topic: "openai",
    cluster: "OpenAI / GPT",
    intent: "implementation",
    priority: "P1",
    type: "tutorial",
    title: "OpenAI Responses API patterns for tools, state, and structured output",
    status: "planned",
    rationale: "SDK release notes cover identifiers and transport, but not the core application integration path.",
  },
  {
    topic: "open-source-llms",
    cluster: "Local inference / open-source",
    intent: "comparison",
    priority: "P2",
    type: "comparison",
    title: "Local inference choices: Ollama, Transformers, and GGUF workflows",
    status: "planned",
    rationale: "Ollama and Transformers posts are isolated; readers lack a decision framework across runtimes.",
  },
  {
    topic: "claude",
    cluster: "Claude / Anthropic",
    intent: "API architecture",
    priority: "P2",
    type: "explainer",
    title: "Claude API tool use and production guardrails",
    status: "planned",
    rationale: "The Claude cluster has broad coverage but needs a focused tool-use and governance explanation.",
  },
  {
    topic: "rag",
    cluster: "Agents / Retrieval",
    intent: "implementation",
    priority: "P2",
    type: "tutorial",
    title: "RAG grounding failures: retrieval checks, citations, and fallback behavior",
    status: "planned",
    rationale: "RAG is registered as a topic but has no post covering the practical failure modes.",
  },
  {
    topic: "ai-agents",
    cluster: "Agents",
    intent: "debugging",
    priority: "P2",
    type: "troubleshooting",
    title: "Debugging tool-call failures in multi-step AI agents",
    status: "planned",
    rationale: "The cluster explains control patterns but lacks a concrete diagnostic path for failed tool calls.",
  },
];

const priorityRank: Record<GapPriority, number> = { P1: 0, P2: 1, P3: 2 };

export function gapFor(topic: string | undefined, guideType: GuideType): ContentGap | undefined {
  return contentGaps.find(
    (gap) => gap.status === "planned" && gap.topic === topic && gap.type === guideType,
  );
}

export function compareGapPriority(left?: ContentGap, right?: ContentGap): number {
  if (left && right) return priorityRank[left.priority] - priorityRank[right.priority];
  if (left) return -1;
  if (right) return 1;
  return 0;
}
