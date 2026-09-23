import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { categories, topics, type TopicDefinition, type CategoryDefinition } from "../../topics.ts";
import { sitePath } from "../../agent.config.ts";

export type { TopicDefinition, CategoryDefinition };

export interface ExistingPost {
  slug: string;
  file: string;
  kind: "news" | "guides";
  title: string;
  topic?: string;
  category?: string;
  guideType?: string;
  published: string;
}

// LockDraft's Firefly theme has a single `posts` content collection (see
// src/content.config.ts) rather than separate news/guides directories. The
// agent still tracks news vs. guides internally (word count floors, table
// requirements, planner logic), but both publish into the same directory;
// `kind` is inferred from tags on read.
const POSTS_DIR = path.join(sitePath, "src/content/posts");
const NEWS_TAG = "ai-news";

export async function loadTopics(): Promise<TopicDefinition[]> {
  return topics;
}

export async function loadCategories(): Promise<CategoryDefinition[]> {
  return categories;
}

export async function loadExistingPosts(): Promise<ExistingPost[]> {
  let files: string[];
  try {
    files = (await fs.readdir(POSTS_DIR)).filter(
      (f) => (f.endsWith(".md") || f.endsWith(".mdx")) && !f.startsWith("_"),
    );
  } catch {
    return [];
  }

  const posts: ExistingPost[] = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf-8");
    const { data } = matter(raw);
    const tags: string[] = Array.isArray(data.tags) ? data.tags : [];
    // Existing human-written posts store `category` as a display name (e.g.
    // "Automation"); the agent's own posts do the same for consistency on
    // the site (see markdown-git.ts). Resolve back to a category id here so
    // the planner's coverage counting (keyed by id) sees both.
    const categoryId = categories.find(
      (c) => c.name.toLowerCase() === String(data.category ?? "").toLowerCase(),
    )?.id;
    posts.push({
      slug: file.replace(/\.mdx?$/, ""),
      file,
      kind: tags.includes(NEWS_TAG) ? "news" : "guides",
      title: data.title ?? "",
      topic: tags.find((t) => topics.some((topic) => topic.id === t)),
      category: categoryId,
      guideType: tags.find((t) =>
        ["tutorial", "explainer", "comparison", "workflow-recipe", "troubleshooting"].includes(t),
      ),
      published: data.published ? new Date(data.published).toISOString() : "",
    });
  }
  return posts;
}

export function contentDirFor(_kind: "news" | "guides"): string {
  return POSTS_DIR;
}

export function imagesDirFor(_kind: "news" | "guides"): string {
  return path.join(sitePath, "public/images/posts");
}
