import type { SourceItem } from "../../core/types.ts";
import { githubReleaseSources } from "../../../agent.config.ts";

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  body: string | null;
  html_url: string;
  published_at: string | null;
  draft: boolean;
  prerelease: boolean;
}

/**
 * Fetches the latest releases from configured GitHub repos via the
 * unauthenticated REST API (60 req/hour — comfortably enough for a
 * handful of repos on a 2-hourly cron). Release notes are used verbatim
 * as the source text, since they're already an authoritative, version-
 * accurate summary — no need to re-scrape the release page.
 */
export async function fetchGithubReleases(): Promise<SourceItem[]> {
  const results = await Promise.allSettled(
    githubReleaseSources.map(async (source) => {
      const res = await fetch(
        `https://api.github.com/repos/${source.repo}/releases?per_page=5`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "lockdraft-content-agent/0.1",
          },
        },
      );
      if (!res.ok) throw new Error(`GitHub releases ${source.repo}: ${res.status}`);
      const releases = (await res.json()) as GitHubRelease[];
      return releases
        .filter((r) => !r.draft && !r.prerelease && r.published_at)
        .map(
          (r): SourceItem => ({
            id: `github-release:${source.repo}:${r.tag_name}`,
            topic: source.topic,
            kind: "github-release",
            sourceName: source.name,
            sourceUrl: r.html_url,
            title: `${source.name} ${r.tag_name}${r.name && r.name !== r.tag_name ? ` — ${r.name}` : ""}`,
            summary: (r.body ?? "").slice(0, 4000),
            publishedAt: r.published_at as string,
          }),
        );
    }),
  );

  for (const r of results) {
    if (r.status === "rejected") console.warn(`[github-releases] ${(r.reason as Error).message}`);
  }

  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
