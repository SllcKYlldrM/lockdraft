import Parser from "rss-parser";
import type { SourceItem } from "../../core/types.ts";
import { rssSources } from "../../../agent.config.ts";

const parser = new Parser();

/** Fetches recent items from configured official-blog RSS feeds. */
export async function fetchRssNews(): Promise<SourceItem[]> {
  const results = await Promise.allSettled(
    rssSources.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        return (feed.items ?? []).map((item): SourceItem => {
          const link = item.link ?? source.url;
          const guid = item.guid ?? link;
          return {
            id: `rss:${source.name}:${guid}`,
            topic: source.topic,
            kind: "rss",
            sourceName: source.name,
            sourceUrl: link,
            title: item.title ?? "(untitled)",
            summary: (item.contentSnippet ?? item.content ?? "").slice(0, 1500),
            publishedAt: item.isoDate ?? new Date().toISOString(),
          };
        });
      } catch (err) {
        throw new Error(`${source.name} (${source.url}): ${(err as Error).message}`);
      }
    }),
  );

  for (const r of results) {
    if (r.status === "rejected") console.warn(`[rss] ${(r.reason as Error).message}`);
  }

  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
