import { promptCategories } from "../../../topics.ts";
import type { ExistingPrompt } from "../../adapters/site-context.ts";
import type { PromptCandidate } from "../types.ts";

/**
 * Picks the next prompt-collection category to add to, using the same
 * least-covered-first balancing as planGuideCandidates — so the prompts
 * section doesn't pile up in one category (e.g. every new prompt being
 * "coding") while others stay thin.
 */
export function planPromptCandidate(existingPrompts: ExistingPrompt[]): PromptCandidate {
  const counts = new Map<string, number>();
  for (const category of promptCategories) counts.set(category, 0);
  for (const prompt of existingPrompts) {
    if (promptCategories.includes(prompt.category)) {
      counts.set(prompt.category, (counts.get(prompt.category) ?? 0) + 1);
    }
  }
  const [category] = [...promptCategories].sort(
    (a, b) => (counts.get(a) ?? 0) - (counts.get(b) ?? 0),
  );

  return {
    category: category ?? promptCategories[0]!,
    existingTitles: existingPrompts
      .filter((p) => p.category === category)
      .map((p) => p.title),
  };
}
