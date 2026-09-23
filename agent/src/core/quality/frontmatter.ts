import { z } from "zod";
import type { ArticleFrontmatter } from "../types.ts";

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
  image: z
    .string()
    .refine((v) => v.startsWith("/"), "image must start with /")
    .optional(),
  imageAlt: z.string().optional(),
  published: z.string().min(1),
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
  // `image`/`imageAlt` are set by the artist role after this validation
  // normally runs during the pipeline (frontmatter is checked before the
  // cover is generated), so map from the agent's internal `cover`/`coverAlt`
  // naming only when present.
  const mapped = {
    title: frontmatter.title,
    slug: frontmatter.slug,
    description: frontmatter.description,
    category: frontmatter.category,
    tags: frontmatter.tags,
    image: frontmatter.cover,
    imageAlt: frontmatter.coverAlt,
    published: frontmatter.published,
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

  return { valid: errors.length === 0, errors };
}
