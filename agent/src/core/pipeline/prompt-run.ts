import { planPromptCandidate } from "../roles/prompt-planner.ts";
import { writePrompt } from "../roles/prompt-writer.ts";
import { reviewPrompt } from "../roles/editor.ts";
import { validatePromptFrontmatter } from "../quality/frontmatter.ts";
import { loadExistingPrompts } from "../../adapters/site-context.ts";
import { publishPrompt } from "../../adapters/publisher/markdown-git.ts";
import { appendRun } from "../../adapters/run-log.ts";
import { emitAgentActivity } from "../../adapters/activity-log.ts";
import { limits } from "../../../agent.config.ts";
import type { RunSummary } from "../types.ts";

export interface PromptRunOptions {
  dryRun?: boolean;
}

/**
 * Writes one new reusable prompt template for the src/content/prompts/
 * collection, filling the least-covered category (see prompt-planner.ts).
 * Mirrors guide-run.ts's shape but is simpler: no external source
 * grounding (a prompt template makes no factual claims to verify against),
 * no cover image (the prompts collection has no image field).
 */
export async function runPromptPipeline(opts: PromptRunOptions = {}): Promise<RunSummary> {
  const startedAt = new Date().toISOString();
  const runId = `prompt-${startedAt}`;
  const emit = (
    workerId: string,
    workerName: string,
    status: "active" | "done" | "waiting" | "error",
    label: string,
    detail?: string,
  ) => emitAgentActivity({ runId, pipeline: "prompt", workerId, workerName, status, label, detail });

  emit("prompt", "Prompt Agent", "active", "Prompt pipeline started");
  const published: string[] = [];
  const rejected: { id: string; reason: string }[] = [];
  const errors: string[] = [];
  const notes: string[] = [];

  try {
    const existingPrompts = await loadExistingPrompts();
    const usedSlugs = new Set(existingPrompts.map((p) => p.slug));

    emit("prompt-planner", "Prompt Planner", "active", "Finding the least-covered prompt category");
    const candidate = planPromptCandidate(existingPrompts);
    emit("prompt-planner", "Prompt Planner", "done", `Selected category "${candidate.category}"`);

    emit("prompt-writer", "Prompt Writer", "active", `Writing a new "${candidate.category}" prompt`);
    let article = await writePrompt(candidate);
    emit("prompt-writer", "Prompt Writer", "done", `Drafted "${article.frontmatter.title}"`);
    emit("prompt-editor", "Prompt Editor", "active", `Reviewing "${article.frontmatter.title}"`);
    let verdict = await reviewPrompt(article, candidate.existingTitles);
    emit("prompt-editor", "Prompt Editor", "done", "Initial review completed");

    let attempts = 0;
    while (verdict.status === "revise" && attempts < limits.maxRevisions) {
      emit("prompt-writer", "Prompt Writer", "active", `Revision ${attempts + 1}/${limits.maxRevisions}`);
      article = await writePrompt(candidate, verdict.issues);
      emit("prompt-writer", "Prompt Writer", "done", `Revision ${attempts + 1} drafted`);
      emit("prompt-editor", "Prompt Editor", "active", "Reviewing revision");
      verdict = await reviewPrompt(article, candidate.existingTitles);
      emit("prompt-editor", "Prompt Editor", "done", "Revision reviewed");
      attempts++;
    }

    if (verdict.status !== "pass") {
      rejected.push({
        id: article.frontmatter.title,
        reason: `editor: ${verdict.issues.join("; ")}`,
      });
    } else {
      if (usedSlugs.has(article.frontmatter.slug)) {
        article.frontmatter.slug = `${article.frontmatter.slug}-${Date.now().toString(36)}`;
      }

      const validation = validatePromptFrontmatter(article.frontmatter, article.promptTemplate);
      if (!validation.valid) {
        rejected.push({
          id: article.frontmatter.title,
          reason: `frontmatter: ${validation.errors.join("; ")}`,
        });
      } else {
        if (!opts.dryRun) {
          emit("prompt-publisher", "Prompt Publisher", "active", `Publishing ${article.frontmatter.slug}`);
          await publishPrompt(article);
          emit("prompt-publisher", "Prompt Publisher", "done", `Published ${article.frontmatter.slug}`);
        }
        published.push(article.frontmatter.slug);
      }
    }
  } catch (err) {
    errors.push(`prompt pipeline: ${(err as Error).message}`);
    emit("prompt", "Prompt Agent", "error", "Prompt pipeline failed", (err as Error).message);
  }

  const summary: RunSummary = {
    runId,
    pipeline: "prompt",
    startedAt,
    finishedAt: new Date().toISOString(),
    published,
    rejected,
    errors,
    notes,
  };
  if (!opts.dryRun) await appendRun(summary);
  emit(
    "prompt",
    "Prompt Agent",
    errors.length > 0 ? "error" : "done",
    errors.length > 0 ? "Prompt pipeline finished with errors" : "Prompt pipeline completed",
  );
  return summary;
}
