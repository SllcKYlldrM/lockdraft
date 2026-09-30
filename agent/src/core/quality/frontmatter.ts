import { z } from "zod";
import type { ArticleFrontmatter, PromptFrontmatter } from "../types.ts";
import {
  isKnownCategory,
  isKnownPromptCategory,
  SITE_AUTHOR,
  validatePromptTags,
} from "./editorial.ts";

// Mirrors lockdraft/src/content.config.ts `postsCollection` schema. Keep in
// sync manually — this is the pre-write gate that stops a malformed file
// from ever reaching the Astro content collection (which would fail the
// site build).
//
// The site's `posts` collection has no news/guide-specific fields (no
// `sourceUrl`, `newsType`, `guideType`, ...) — those are agent-internal and
// get folded into `tags`/`sourceLink` by the publisher before this runs, so
// this schema only needs to match what actually lands in the .md file.

const baseFields = {
  title: z.string().min(1).max(100),
  slug: z.string().min(1),
  description: z.string().min(1).max(160),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  published: z.string().min(1),
  updated: z.string().min(1).optional(),
  author: z.string().min(1),
  draft: z.boolean(),
  sourceLink: z.string().url().optional(),
};

export const newsFrontmatterSchema = z.object(baseFields);
export const guideFrontmatterSchema = z.object(baseFields);

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateFrontmatter(
  kind: "news" | "guides",
  frontmatter: ArticleFrontmatter,
  knownTopicIds: string[],
): ValidationResult {
  const mapped = {
    title: frontmatter.title,
    slug: frontmatter.slug,
    description: frontmatter.description,
    category: frontmatter.category,
    tags: frontmatter.tags,
    published: frontmatter.published,
    updated: frontmatter.updated,
    author: frontmatter.author,
    draft: frontmatter.draft,
    sourceLink: frontmatter.sourceUrl,
  };

  const schema = kind === "news" ? newsFrontmatterSchema : guideFrontmatterSchema;
  const result = schema.safeParse(mapped);
  const errors = result.success
    ? []
    : result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);

  if (frontmatter.topic && !knownTopicIds.includes(frontmatter.topic)) {
    errors.push(`topic "${frontmatter.topic}" is not in topics.ts`);
  }
  if (!isKnownCategory(frontmatter.category)) {
    errors.push(`category "${frontmatter.category}" is not in the closed post taxonomy`);
  }
  if (frontmatter.author !== SITE_AUTHOR) {
    errors.push(`author must be "${SITE_AUTHOR}"`);
  }
  if (kind === "news" && !frontmatter.sourceUrl?.trim()) {
    errors.push("news articles require an official source URL");
  }

  return { valid: errors.length === 0, errors };
}

// Mirrors `promptsCollection` in content.config.ts.
export const promptFrontmatterSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().min(1),
  description: z.string().min(1).max(160),
  category: z.string().min(1),
  models: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  published: z.string().min(1),
  draft: z.boolean(),
  prompt: z.string().min(1),
});

export function validatePromptFrontmatter(
  frontmatter: PromptFrontmatter,
  promptTemplate: string,
): ValidationResult {
  const result = promptFrontmatterSchema.safeParse({ ...frontmatter, prompt: promptTemplate });
  const errors = result.success
    ? []
    : result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
  if (!isKnownPromptCategory(frontmatter.category)) {
    errors.push(`category "${frontmatter.category}" is not in the closed prompt taxonomy`);
  }
  if (frontmatter.tags.length === 0) {
    errors.push("prompt tags must contain at least one canonical tag");
  }
  errors.push(...validatePromptTags(frontmatter.tags));
  return { valid: errors.length === 0, errors };
}
