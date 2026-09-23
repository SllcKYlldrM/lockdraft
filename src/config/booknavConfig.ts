import type { BooknavGroup, BooknavPageConfig } from "../types/booknavConfig";

// 书签导航页面配置
export const booknavPageConfig: BooknavPageConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// favicon 自动获取配置
	favicon: {
		// 书签未填写 icon 时，是否自动获取目标站点的 favicon 图标
		enabled: true,

		// favicon 接口地址，{domain} 为占位符，会被替换成目标站点域名
		// 更换接口只需保证地址里含有 {domain}，例如：
		//   https://a.favicon.im/{domain}
		//   https://favicon.im/{domain}
		api: "https://a.favicon.im/{domain}",
	},
};

// 书签导航配置
// 每个数组项是一个分类组，分类组内的 items 是该分类下的书签
export const booknavConfig: BooknavGroup[] = [
	{
		id: "models",
		name: "Models & Labs",
		icon: "material-symbols:smart-toy-outline-rounded",
		desc: "Frontier AI labs and model providers",
		weight: 100,
		items: [
			{
				title: "Anthropic",
				url: "https://www.anthropic.com",
				desc: "Maker of the Claude model family",
				weight: 10,
			},
			{
				title: "OpenAI",
				url: "https://openai.com",
				desc: "Maker of the GPT model family",
				weight: 9,
			},
			{
				title: "Google DeepMind",
				url: "https://deepmind.google",
				desc: "Maker of the Gemini model family",
				weight: 8,
			},
			{
				title: "Hugging Face",
				url: "https://huggingface.co",
				desc: "Open models, datasets & spaces",
				weight: 7,
			},
		],
	},
	{
		id: "agents",
		name: "Agents & Orchestration",
		icon: "material-symbols:hub-outline-rounded",
		desc: "Frameworks for building AI agents",
		weight: 90,
		items: [
			{
				title: "Model Context Protocol",
				url: "https://modelcontextprotocol.io",
				desc: "Open standard for connecting agents to tools & data",
				weight: 10,
			},
			{
				title: "LangGraph",
				url: "https://langchain-ai.github.io/langgraph/",
				desc: "Build stateful, multi-agent applications",
				weight: 9,
			},
			{
				title: "CrewAI",
				url: "https://www.crewai.com",
				desc: "Framework for orchestrating role-playing agents",
				weight: 8,
			},
			{
				title: "Claude Agent SDK",
				url: "https://docs.claude.com/en/api/agent-sdk/overview",
				desc: "Build custom agents on top of Claude",
				weight: 7,
			},
		],
	},
	{
		id: "automation",
		name: "Automation",
		icon: "material-symbols:bolt-rounded",
		desc: "No-code and low-code workflow builders",
		weight: 80,
		items: [
			{
				title: "n8n",
				url: "https://n8n.io",
				desc: "Self-hostable workflow automation platform",
				weight: 10,
			},
			{
				title: "Make",
				url: "https://www.make.com",
				desc: "Visual platform for building automations",
				weight: 9,
			},
			{
				title: "Zapier",
				url: "https://zapier.com",
				desc: "Connect apps and automate workflows",
				weight: 8,
			},
		],
	},
	{
		id: "learning",
		name: "Learning & Docs",
		icon: "material-symbols:auto-stories-outline-rounded",
		desc: "Documentation, courses and deep dives",
		weight: 70,
		items: [
			{
				title: "Claude Docs",
				url: "https://docs.claude.com",
				desc: "Official documentation for the Claude API",
				weight: 10,
			},
			{
				title: "Prompt Engineering Guide",
				url: "https://www.promptingguide.ai",
				desc: "Comprehensive guide to prompt engineering",
				weight: 9,
			},
			{
				title: "Papers with Code",
				url: "https://paperswithcode.com",
				desc: "Machine learning papers with source code",
				weight: 8,
			},
		],
	},
];
