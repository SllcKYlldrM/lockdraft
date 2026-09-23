// LockDraft's topic/category registry for the content agent. This is the
// AI/automation equivalent of Metarotation's games.ts + categories.ts: the
// axis the planner uses to find coverage gaps and the axis the writer uses
// for grounding context (officialUrl → guide-fact-pack.ts).
//
// officialUrl should point at a docs/changelog/blog page with enough real
// prose for Readability to extract (see guide-fact-pack.ts's
// MIN_GUIDE_SOURCE_WORDS) — a marketing landing page usually won't qualify.
// Every URL below was checked with `npx tsx fetch-test.mjs <url>` (a small
// scratch script using article-fetcher.ts's own Readability extraction) on
// 2026-09-24 and cleared the 250-word floor; several obvious first choices
// (news/blog index pages, client-rendered SPA docs like LangChain's or
// Zapier's help center) did not and were swapped for a deeper page. Re-run
// that check before changing any of these.

export interface TopicDefinition {
  id: string;
  name: string;
  category: string;
  officialUrl: string;
  shortDescription: string;
}

export interface CategoryDefinition {
  id: string;
  name: string;
  slug: string;
}

// Every category here must have at least one topic pointing at it (see
// `topics` below) — planGuideCandidates in roles/planner.ts only generates
// guide candidates for a category by filtering topics whose `category`
// matches its id, so an orphaned category id would silently never produce
// any guides.
export const categories: CategoryDefinition[] = [
  { id: "ai-news", name: "AI News", slug: "ai-news" },
  { id: "agents", name: "Agents", slug: "agents" },
  { id: "automation", name: "Automation", slug: "automation" },
  { id: "prompt-engineering", name: "Prompt Engineering", slug: "prompt-engineering" },
];

export const topics: TopicDefinition[] = [
  {
    id: "claude",
    name: "Claude",
    category: "ai-news",
    officialUrl: "https://docs.claude.com/en/docs/build-with-claude/overview",
    shortDescription: "Anthropic's Claude model family and Claude Code.",
  },
  {
    id: "openai",
    name: "OpenAI / GPT",
    category: "ai-news",
    officialUrl: "https://platform.openai.com/docs/guides/text",
    shortDescription: "OpenAI's GPT models, tools, and API.",
  },
  {
    id: "gemini",
    name: "Gemini",
    category: "ai-news",
    officialUrl: "https://ai.google.dev/gemini-api/docs/text-generation",
    shortDescription: "Google DeepMind's Gemini models and AI products.",
  },
  {
    id: "open-source-llms",
    name: "Open-source LLMs",
    category: "ai-news",
    officialUrl: "https://huggingface.co/docs/transformers/quicktour",
    shortDescription: "Open-weight models (Llama, Qwen, DeepSeek, Mistral) and local inference.",
  },
  {
    id: "claude-code",
    name: "Claude Code & AI coding agents",
    category: "agents",
    officialUrl: "https://docs.claude.com/en/docs/claude-code/overview",
    shortDescription: "Claude Code, Cursor, and other agentic coding tools.",
  },
  {
    id: "ai-agents",
    name: "AI agents & agent frameworks",
    category: "agents",
    officialUrl: "https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview",
    shortDescription: "Agent architectures, tool use, and orchestration frameworks.",
  },
  {
    id: "mcp",
    name: "Model Context Protocol",
    category: "agents",
    officialUrl: "https://modelcontextprotocol.io/docs/concepts/architecture",
    shortDescription: "MCP servers, clients, and the tool-calling ecosystem around it.",
  },
  {
    id: "n8n",
    name: "n8n",
    category: "automation",
    officialUrl: "https://docs.n8n.io/try-it-out/quickstart/",
    shortDescription: "Self-hostable workflow automation with n8n.",
  },
  {
    id: "make-zapier",
    name: "Make & Zapier",
    category: "automation",
    // Both vendors' help centers/community sites are client-rendered SPAs
    // that Readability can't extract from server HTML (verified
    // 2026-09-24 — every help.zapier.com/community.make.com URL tried
    // returned 0 words). Zapier's blog index is the only reachable page
    // with enough static prose; it's a rotating list rather than a stable
    // reference, so re-check this one more often than the others and swap
    // it for a real docs page if either vendor ships one that
    // server-renders content.
    officialUrl: "https://zapier.com/blog",
    shortDescription: "No-code automation platforms: Make (Integromat) and Zapier.",
  },
  {
    id: "rag",
    name: "RAG & retrieval",
    category: "agents",
    officialUrl: "https://docs.llamaindex.ai/en/stable/understanding/rag/",
    shortDescription: "Retrieval-augmented generation, vector search, and grounding.",
  },
  {
    id: "prompt-engineering",
    name: "Prompt engineering",
    category: "prompt-engineering",
    officialUrl: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct",
    shortDescription: "Structuring prompts and system messages for reliable output.",
  },
];
