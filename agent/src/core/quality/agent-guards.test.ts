import assert from "node:assert/strict";
import test from "node:test";
import type { PromptArticle, PromptReference } from "../types.ts";
import { decideNewsCandidate, decidePromptArticle, evaluatePublishGate } from "./growth.ts";
import { normalizePromptTags, validatePromptTags } from "./editorial.ts";
import { validatePromptFrontmatter } from "./frontmatter.ts";
import { assessSourceReadiness, isValidSourceUrl } from "./source.ts";

const existingPrompt: PromptReference = {
  slug: "debug-stack-trace",
  title: "Debug code errors",
  category: "coding",
  description: "Find the root cause of a code error.",
  promptTemplate: "Analyze this error and explain the likely root cause: {{error}}",
  tags: ["debugging", "errors"],
};

function prompt(title: string, promptTemplate: string): PromptArticle {
  return {
    frontmatter: {
      title,
      slug: title.toLowerCase().replaceAll(" ", "-"),
      description: "A reusable prompt template.",
      category: "coding",
      models: ["GPT"],
      tags: ["debugging"],
      difficulty: "beginner",
      published: "2026-09-30T00:00:00.000Z",
      draft: false,
    },
    promptTemplate,
    body: "## When to use this\n\nUse it when needed.\n\n## Tips\n\n- Include context.",
  };
}

test("prompt taxonomy canonicalizes case and rejects unknown tags", () => {
  assert.deepEqual(normalizePromptTags(["Agents", "agents", "tool-use"]), ["agents", "tool-use"]);
  assert.match(validatePromptTags(["made-up-tag"])[0] ?? "", /closed prompt tag inventory/);
});

test("prompt frontmatter requires a closed category and non-empty canonical tags", () => {
  const result = validatePromptFrontmatter({
    ...prompt("A reusable prompt", "Do this for {{input}}").frontmatter,
    category: "unknown",
    tags: [],
  }, "Do this for {{input}}");
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("closed prompt taxonomy")));
  assert.ok(result.errors.some((error) => error.includes("at least one canonical tag")));
});

test("prompt decision layer skips duplicates, routes near matches to review, and creates unique intents", () => {
  assert.equal(decidePromptArticle(prompt("Debug code errors", "Analyze {{error}}"), [existingPrompt]).decision, "SKIP");
  assert.equal(decidePromptArticle(prompt("Debug workflow errors", "Analyze {{workflow_error}}"), [existingPrompt]).decision, "UPDATE EXISTING");
  assert.equal(decidePromptArticle(prompt("Design a migration rollout checklist", "Plan {{migration}}"), [existingPrompt]).decision, "CREATE");
});

test("news minor releases skip and source helpers reject unusable input", () => {
  assert.equal(decideNewsCandidate({
    id: "release:1",
    kind: "github-release",
    sourceName: "Example",
    sourceUrl: "https://example.com/release",
    title: "Example 1.2.3 maintenance patch",
    summary: "A minor maintenance patch.",
    publishedAt: "2026-09-30T00:00:00.000Z",
  }, []).decision, "SKIP");
  assert.equal(isValidSourceUrl("not-a-url"), false);
  assert.equal(assessSourceReadiness("too short", 10).ready, false);
  assert.equal(assessSourceReadiness("one two three four five six seven eight nine ten", 10).ready, true);
});

test("publish gate evaluates actual guide overlap and internal-link count", () => {
  const article = {
    kind: "guides" as const,
    frontmatter: {
      title: "Guide",
      slug: "guide",
      description: "Guide description",
      category: "tutorials",
      tags: ["tutorial"],
      published: "2026-09-30T00:00:00.000Z",
      author: "LockDraft",
      draft: false,
    },
    body: "## Sources\n\n- [Official source](https://example.com)",
  };
  assert.equal(evaluatePublishGate(article, "source text", 0.2, 1, 0.12).valid, false);
  assert.equal(evaluatePublishGate(article, "source text", 0, 0, 0.12).valid, true);
});
