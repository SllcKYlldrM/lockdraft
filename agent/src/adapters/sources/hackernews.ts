import type { SourceItem } from "../../core/types.ts";
import { hackerNewsSources } from "../../../agent.config.ts";

interface AlgoliaHit {
  objectID: string;
  title: string | null;
  url: string | null;
  points: number | null;
  created_at: string;
  story_text: string | null;
}

/**
 * Fetches recent, high-scoring Hacker News stories via the unauthenticated
 * Algolia search API, filtered per query by a minimum point threshold —
 * cross-topic industry signal that isn't tied to any single vendor's blog.
 */
export async function fetchHackerNews(): Promise<SourceItem[]> {
  const results = await Promise.allSettled(
    hackerNewsSources.map(async (source) => {
      const url = new URL("https://hn.algolia.com/api/v1/search_by_date");
      url.searchParams.set("tags", "story");
      url.searchParams.set("query", source.query);
      url.searchParams.set("hitsPerPage", "10");

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Hacker News "${source.query}": ${res.status}`);
      const data = (await res.json()) as { hits?: AlgoliaHit[] };
      return (data.hits ?? [])
        .filter((h) => h.title && (h.points ?? 0) >= source.minPoints)
        .map(
          (h): SourceItem => ({
            id: `hackernews:${h.objectID}`,
            kind: "hackernews",
            sourceName: "Hacker News",
            sourceUrl: h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`,
            title: h.title as string,
            summary: (h.story_text ?? "").slice(0, 1500),
            publishedAt: h.created_at,
          }),
        );
    }),
  );

  for (const r of results) {
    if (r.status === "rejected") console.warn(`[hackernews] ${(r.reason as Error).message}`);
  }

  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
