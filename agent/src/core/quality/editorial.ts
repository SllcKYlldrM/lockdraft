import { categories, postTagInventory } from "../../../topics.ts";

export const SITE_AUTHOR = "LockDraft";
export const MAX_POST_TAGS = 6;

export interface InternalLinkCandidate {
  slug: string;
  title: string;
  category?: string;
}

export function normalizeTags(tags: string[]): string[] {
  const normalized = tags
    .map((tag) => tag.trim())
    .map((tag) =>
      postTagInventory.find((canonical) => canonical.toLowerCase() === tag.toLowerCase()),
    )
    .filter((tag): tag is (typeof postTagInventory)[number] => Boolean(tag));

  return [...new Set(normalized)].slice(0, MAX_POST_TAGS);
}

export function isKnownCategory(category: string): boolean {
  return categories.some((item) => item.id === category);
}

export function hasSourcesSection(body: string): boolean {
  return /(^|\n)#{2,3}\s+(Sources|References)\s*$/im.test(body);
}

export function ensureSourcesSection(body: string, sourceUrl: string): string {
  if (hasSourcesSection(body)) return body.trim();
  return `${body.trim()}\n\n## Sources\n\n- [Official source](${sourceUrl})`;
}

export function ensureContextualInternalLink(
  body: string,
  candidates: InternalLinkCandidate[],
): string {
  const existingLinks = body.match(/\]\(\/posts\//g)?.length ?? 0;
  if (existingLinks > 0 || candidates.length === 0) return body.trim();

  const candidate = candidates[0];
  if (!candidate) return body.trim();
  const sentence = `For related LockDraft context, see [${candidate.title}](/posts/${candidate.slug}/).`;
  const sourcesIndex = body.search(/\n#{2,3}\s+(Sources|References)\s*$/im);
  if (sourcesIndex === -1) return `${body.trim()}\n\n${sentence}`;
  return `${body.slice(0, sourcesIndex).trim()}\n\n${sentence}${body.slice(sourcesIndex)}`;
}
