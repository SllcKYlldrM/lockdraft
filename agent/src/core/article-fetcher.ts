import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import type { SourceItem } from "./types.ts";

/**
 * Downloads a source URL and extracts its main readable text, so the
 * writer works from full context instead of just a feed summary. Returns
 * undefined on any failure (paywall, non-HTML, network error) — callers
 * should fall back to the source item's summary.
 */
export async function fetchArticleText(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LockDraftAgent/0.1)" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return undefined;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) return undefined;

    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const article = new Readability(dom.window.document).parse();
    return article?.textContent?.trim().slice(0, 8000);
  } catch {
    return undefined;
  }
}

/**
 * Picks the best available source text for a candidate: the item's own
 * summary when it's already rich (GitHub's Releases API returns the full
 * release notes body, not just an excerpt — re-scraping the release page
 * there is unnecessary and adds a point of failure). For other source
 * kinds, try scraping the source URL but only prefer it over the existing
 * summary if it's actually more informative — a defensive guard against a
 * page that "technically succeeds" under Readability while actually
 * returning thin nav/chrome text (a client-rendered shell, a login gate,
 * etc.).
 */
export async function getSourceText(item: SourceItem): Promise<string> {
  if (item.kind === "github-release") return item.summary;

  const scraped = await fetchArticleText(item.sourceUrl);
  if (scraped && scraped.length > item.summary.length) return scraped;
  return item.summary;
}

/** Best-effort extraction of a page's og:image URL, for the artist role. */
export async function fetchOgImage(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LockDraftAgent/0.1)" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return undefined;
    const html = await res.text();
    const match = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    );
    return match?.[1];
  } catch {
    return undefined;
  }
}
