import type { SourceItem } from "../types.ts";
import { fetchRssNews } from "../../adapters/sources/rss.ts";
import { fetchRedditPosts } from "../../adapters/sources/reddit.ts";
import { fetchYoutubeVideos } from "../../adapters/sources/youtube.ts";
import { fetchGithubReleases } from "../../adapters/sources/github-releases.ts";
import { fetchHackerNews } from "../../adapters/sources/hackernews.ts";
import { limits } from "../../../agent.config.ts";

/**
 * Gathers fresh items from every source, deduped against `seenIds` and
 * limited to the configured lookback window. Individual source failures
 * are swallowed inside each adapter — scout always returns what it could
 * get, never throws for a single dead feed.
 */
export async function scout(seenIds: Set<string>): Promise<SourceItem[]> {
  const [rss, reddit, youtube, githubReleases, hackerNews] = await Promise.all([
    fetchRssNews(),
    fetchRedditPosts(),
    fetchYoutubeVideos(),
    fetchGithubReleases(),
    fetchHackerNews(),
  ]);

  const all = [...rss, ...reddit, ...youtube, ...githubReleases, ...hackerNews];
  const cutoff = Date.now() - limits.newsLookbackHours * 60 * 60 * 1000;

  return all.filter(
    (item) =>
      !seenIds.has(item.id) && new Date(item.publishedAt).getTime() >= cutoff,
  );
}
