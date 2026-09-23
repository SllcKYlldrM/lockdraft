import type { SourceItem } from "../../core/types.ts";
import { redditSources } from "../../../agent.config.ts";

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  permalink: string;
  url: string;
  created_utc: number;
  ups: number;
  link_flair_text: string | null;
  stickied: boolean;
}

let cachedToken: { token: string; expiresAt: number } | undefined;

async function getAccessToken(): Promise<string | undefined> {
  const id = process.env.REDDIT_CLIENT_ID;
  const secret = process.env.REDDIT_CLIENT_SECRET;
  if (!id || !secret) return undefined;
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "lockdraft-content-agent/0.1",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) return undefined;
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

/**
 * Fetches "hot" posts from configured subreddits, filtered to high-signal
 * items (upvotes or official flair) so noise doesn't reach the planner.
 */
export async function fetchRedditPosts(
  minUpvotes = 100,
): Promise<SourceItem[]> {
  const token = await getAccessToken();
  if (!token) {
    console.warn("[reddit] disabled: REDDIT_CLIENT_ID/REDDIT_CLIENT_SECRET not set (or token request failed)");
    return [];
  }

  const results = await Promise.allSettled(
    redditSources.map(async (source) => {
      const res = await fetch(
        `https://oauth.reddit.com/r/${source.subreddit}/hot?limit=15`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "lockdraft-content-agent/0.1",
          },
        },
      );
      if (!res.ok) throw new Error(`Reddit r/${source.subreddit}: ${res.status}`);
      const data = (await res.json()) as {
        data?: { children?: { data: RedditPost }[] };
      };
      const posts = (data.data?.children ?? []).map((c) => c.data);
      return posts
        .filter(
          (p) =>
            !p.stickied &&
            (p.ups >= minUpvotes ||
              /official|dev|patch|announcement/i.test(p.link_flair_text ?? "")),
        )
        .map(
          (p): SourceItem => ({
            id: `reddit:${source.subreddit}:${p.id}`,
            topic: source.topic,
            kind: "reddit",
            sourceName: `r/${source.subreddit}`,
            sourceUrl: `https://www.reddit.com${p.permalink}`,
            title: p.title,
            summary: (p.selftext || "").slice(0, 1500),
            publishedAt: new Date(p.created_utc * 1000).toISOString(),
          }),
        );
    }),
  );

  for (const r of results) {
    if (r.status === "rejected") console.warn(`[reddit] ${(r.reason as Error).message}`);
  }

  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
