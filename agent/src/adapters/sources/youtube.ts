import type { SourceItem } from "../../core/types.ts";
import { youtubeSources } from "../../../agent.config.ts";

interface YoutubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
  };
}

/** Fetches recent uploads from configured official YouTube channels. */
export async function fetchYoutubeVideos(): Promise<SourceItem[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || youtubeSources.length === 0) return [];

  const results = await Promise.allSettled(
    youtubeSources.map(async (source) => {
      const url = new URL("https://www.googleapis.com/youtube/v3/search");
      url.searchParams.set("key", apiKey);
      url.searchParams.set("channelId", source.channelId);
      url.searchParams.set("part", "snippet");
      url.searchParams.set("order", "date");
      url.searchParams.set("maxResults", "5");
      url.searchParams.set("type", "video");

      const res = await fetch(url);
      if (!res.ok) throw new Error(`YouTube ${source.name}: ${res.status}`);
      const data = (await res.json()) as { items?: YoutubeSearchItem[] };
      return (data.items ?? []).map(
        (item): SourceItem => ({
          id: `youtube:${item.id.videoId}`,
          topic: source.topic,
          kind: "youtube",
          sourceName: item.snippet.channelTitle || source.name,
          sourceUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          title: item.snippet.title,
          summary: item.snippet.description.slice(0, 1500),
          publishedAt: item.snippet.publishedAt,
        }),
      );
    }),
  );

  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
