import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { generateImage } from "../llm/provider.ts";
import { fetchOgImage } from "../article-fetcher.ts";
import type { Article, CoverResult } from "../types.ts";
import { imagesDirFor } from "../../adapters/site-context.ts";

const COVER_WIDTH = 1200;
const COVER_HEIGHT = 630;
const MAX_TITLE_LINE_CHARS = 38;

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[char] ?? char);
}

function titleLines(title: string): string[] {
  const words = title.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > MAX_TITLE_LINE_CHARS) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

async function downloadImage(url: string): Promise<Buffer | undefined> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) return undefined;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return undefined;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return undefined;
  }
}

async function writeCover(
  buffer: Buffer,
  kind: "news" | "guides",
  slug: string,
): Promise<{ filePath: string; publicPath: string }> {
  const dir = imagesDirFor(kind);
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.jpg`);
  await sharp(buffer)
    .resize(COVER_WIDTH, COVER_HEIGHT, { fit: "cover" })
    .jpeg({ quality: 82 })
    .toFile(filePath);
  return { filePath, publicPath: `/images/posts/${slug}.jpg` };
}

async function writeFallbackCover(
  article: Article,
  kind: "news" | "guides",
  slug: string,
  topicName?: string,
): Promise<{ filePath: string; publicPath: string }> {
  const lines = titleLines(article.frontmatter.title);
  const titleMarkup = lines
    .map((line, index) => `<tspan x="90" dy="${index === 0 ? 0 : 62}">${escapeXml(line)}</tspan>`)
    .join("");
  const label = kind === "guides" ? "GUIDE / LOCKDRAFT" : "LOCKDRAFT / AI NEWS";
  const topic = topicName ? escapeXml(topicName.toUpperCase()) : "LOCKDRAFT";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${COVER_WIDTH}" height="${COVER_HEIGHT}" viewBox="0 0 ${COVER_WIDTH} ${COVER_HEIGHT}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0b1120"/><stop offset="0.55" stop-color="#111827"/><stop offset="1" stop-color="#1e293b"/></linearGradient>
      <radialGradient id="glow" cx="85%" cy="15%" r="70%"><stop stop-color="#38bdf8" stop-opacity=".3"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect width="1200" height="630" fill="url(#glow)"/>
    <circle cx="1030" cy="90" r="170" fill="none" stroke="#22d3ee" stroke-opacity=".25" stroke-width="2"/>
    <circle cx="1030" cy="90" r="110" fill="none" stroke="#a5b4fc" stroke-opacity=".35" stroke-width="2"/>
    <path d="M0 520 C260 430 420 650 720 520 S1030 390 1200 470" fill="none" stroke="#22d3ee" stroke-opacity=".14" stroke-width="3"/>
    <rect x="90" y="88" width="92" height="5" rx="2" fill="#38bdf8"/>
    <text x="90" y="145" fill="#7dd3fc" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="3">${label}</text>
    <text x="90" y="220" fill="#ffffff" font-family="Arial, sans-serif" font-size="48" font-weight="700">${titleMarkup}</text>
    <text x="90" y="550" fill="#a5b4fc" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="2">${topic}</text>
    <text x="1110" y="550" text-anchor="end" fill="#bae6fd" font-family="Arial, sans-serif" font-size="17" letter-spacing="2">LOCKDRAFT.COM</text>
  </svg>`;
  return writeCover(Buffer.from(svg), kind, slug);
}

/**
 * Cover priority: official source image (news' sourceUrl og:image)
 * downloaded and resized locally, then Gemini with retries, then the
 * anonymous AI Horde queue as a free last resort, then a guaranteed local
 * branded cover. The article is never rejected only because an external
 * image provider is unavailable.
 */
export async function makeCover(
  article: Article,
  opts: { sourceUrl?: string; topicName?: string },
): Promise<CoverResult> {
  const slug = article.frontmatter.slug;
  const kind = article.kind;

  const officialUrl = opts.sourceUrl ? await fetchOgImage(opts.sourceUrl) : undefined;

  if (officialUrl) {
    const buffer = await downloadImage(officialUrl);
    if (buffer) {
      const { filePath, publicPath } = await writeCover(buffer, kind, slug);
      return {
        filePath,
        publicPath,
        alt: `${article.frontmatter.title} cover image`,
        source: "official",
      };
    }
  }

  const prompt = `A clean, editorial-style cover illustration for a
developer-focused AI/automation article titled "${article.frontmatter.title}"${opts.topicName ? ` about ${opts.topicName}` : ""}.
Abstract, tech-forward digital art — circuit/network motifs, gradients,
minimal geometric shapes. No text, no logos, no screenshots of real UI.
16:9 aspect ratio.`;

  const aiBuffer = await generateImage(prompt);
  if (aiBuffer) {
    const { filePath, publicPath } = await writeCover(aiBuffer, kind, slug);
    return {
      filePath,
      publicPath,
      alt: `${article.frontmatter.title} cover illustration`,
      source: "ai",
    };
  }

  const fallback = await writeFallbackCover(article, kind, slug, opts.topicName);
  return {
    ...fallback,
    alt: `${article.frontmatter.title} editorial cover`,
    source: "fallback",
  };
}
