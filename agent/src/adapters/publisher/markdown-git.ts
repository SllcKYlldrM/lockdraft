import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Article } from "../../core/types.ts";
import { contentDirFor } from "../site-context.ts";
import { categories } from "../../../topics.ts";

/**
 * Writes an article as a Markdown file with YAML frontmatter into the
 * site's `posts` content collection (src/content.config.ts's
 * `postsCollection` schema). Does not touch git — the calling GitHub
 * Actions workflow (or a local `git add/commit/push`) handles that after
 * `pnpm build` passes, so nothing unbuildable ever reaches the repo.
 */
export async function publishArticle(article: Article): Promise<string> {
  const dir = contentDirFor(article.kind);
  await fs.mkdir(dir, { recursive: true });

  const fm = article.frontmatter;
  const categoryName = categories.find((c) => c.id === fm.category)?.name ?? fm.category;

  // Extra agent-internal fields (topic, newsType, guideType, relatedGuides)
  // have no home in the site's schema — they're folded into tags instead,
  // matching the human-written posts' convention of tagging by subject.
  const extraTags: string[] = [fm.newsType, fm.guideType].filter(Boolean) as string[];
  const tags = [...new Set([...fm.tags, ...extraTags])];

  const frontmatter: Record<string, unknown> = {
    title: fm.title,
    published: fm.published,
    draft: fm.draft,
    description: fm.description,
    image: fm.cover,
    tags,
    category: categoryName,
    author: fm.author,
    sourceLink: fm.sourceUrl,
  };
  // Drop undefined optional fields so gray-matter doesn't emit `key: undefined`.
  for (const key of Object.keys(frontmatter)) {
    if (frontmatter[key] === undefined) delete frontmatter[key];
  }

  // js-yaml (used by gray-matter's stringify) only emits an unquoted YAML
  // timestamp — which Astro's z.date() schema requires — for an actual JS
  // Date value. Our types carry `published` as an ISO string, so a plain
  // string here would get dumped as a quoted string and fail content
  // validation ("Expected type date, received string") at build time.
  if (typeof frontmatter.published === "string") {
    frontmatter.published = new Date(frontmatter.published);
  }

  const file = matter.stringify(`\n${article.body}\n`, frontmatter);
  const filePath = path.join(dir, `${fm.slug}.md`);
  await fs.writeFile(filePath, file, "utf-8");
  return filePath;
}
