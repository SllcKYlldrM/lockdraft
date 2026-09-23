# LockDraft content agent

An independent, multi-role pipeline that watches AI/automation news
sources and writes fully original content for LockDraft — model
releases/tool updates/research news automatically, long-form guides as
drafts for review.

It is a standalone Node/TypeScript package (`agent/`), part of this repo's
pnpm workspace but with its own `package.json`. The only files that know
about the LockDraft site are `src/adapters/site-context.ts` (reads
`topics.ts`/existing posts), `src/adapters/publisher/markdown-git.ts`
(writes the Markdown files), and `topics.ts` itself. Everything under
`src/core/` is portable — moving this pipeline to a different publisher (a
different site, a CMS, an API) means swapping those files, not rewriting
the pipeline.

This is a port of the equivalent agent running on Metarotation
(`Metarotasyon/meta-claude/metarotation/agent`) — same role architecture
and quality gates, adapted from a gaming-news domain (games/Steam/Reddit)
to an AI/automation domain (topics/RSS/GitHub releases/Hacker News). The
two sites currently share the same Gemini/OpenRouter API keys, so their
free-tier quota is shared — see the cron offset in the GitHub Actions
workflows and the lower `maxNewsPerDay` in `agent.config.ts`.

## Roles

| Role | File | Job |
|---|---|---|
| Scout | `src/core/roles/scout.ts` | Pulls fresh items from RSS, GitHub Releases, Hacker News, Reddit, YouTube |
| Planner | `src/core/roles/planner.ts` | Scores news candidates 0-100; picks the next under-covered guide topic |
| Writer | `src/core/roles/writer.ts` | Writes a fully original article from source material (never copies phrasing) |
| Editor | `src/core/roles/editor.ts` | Mechanical checks (word count, tables, duplicate headings) + LLM quality/fact pass |
| Artist | `src/core/roles/artist.ts` | Cover image: official source og:image → Gemini retry → free anonymous AI Horde fallback → local branded fallback |

An `overlapRatio` check (`src/core/quality/overlap.ts`) independently
guards against near-copies by comparing 8-word sequences between the
article and its source — this runs regardless of what the editor says.

## Setup

```bash
cd agent
pnpm install   # or run `pnpm install` at the repo root — agent is a workspace package
cp .env.example .env   # fill in the keys you have; every key is optional,
                        # missing ones just disable that source/model
```

For the full primary path, set `GEMINI_API_KEY`; `OPENROUTER_API_KEY` is the
independent text-generation fallback. Planner uses Gemini 3.5 Flash-Lite;
Writer/Editor use Gemini 3.6 Flash with Gemini 3.5 Flash, then pinned
low-cost Qwen and DeepSeek OpenRouter fallbacks; Artist uses Gemini image
generation. An article always receives a cover: if the official og:image,
Gemini retry, and free anonymous AI Horde fallback are unavailable, the
agent creates a local branded SVG/JPEG cover without an external API.
Higher-risk guides also receive a second Gemini 3.1 Pro review. Reddit and
YouTube keys are optional — those sources are skipped without them
(YouTube has no configured channels by default — see `agent.config.ts`).

OpenRouter's free-model daily cap goes from 50 to 1000 requests/day once
the account has $10+ in lifetime credit — worth topping up even a small
amount if the agent needs to run more than a handful of times per day.

## Running locally

```bash
npm run dry-run   # fetches sources, scores/plans, does NOT call the
                   # writer or write files — safe to run anytime
npm run news       # full news pipeline, writes .md + images if it publishes
npm run guide      # full guide pipeline, writes .md + images if it publishes
```

From the site root, the same commands are available as `pnpm
agent:dry-run` / `pnpm agent:news` / `pnpm agent:guide`.

## How it decides what to publish

- **News**: runs every 2 hours in CI, offset from Metarotation's cron so
  the two sites don't fire their LLM calls at the same minute. Scores
  candidates, writes only those scoring ≥ `limits.newsScoreThreshold`
  (default 75, deliberately strict), capped at `limits.maxNewsPerDay`
  (default 2 — kept low since quota is shared) per UTC day and one
  article per run. Normal articles are separated by at least 6 hours; a
  very recent, first-party candidate scoring 90+ may bypass that spacing as
  breaking news.
  Published with `draft: false` — it goes live as soon as the build passes.
- **Guides**: runs once daily. Builds an ordered list of under-covered
  (topic, guideType) candidates, checks the official source before creating
  a brief, and writes one long-form guide only for the first source-ready
  candidate. Also published with `draft: false` — it goes live automatically
  once the build passes, same as news. There is no manual review step;
  the editor's quality pass and the mechanical checks (word count, table
  count, duplicate headings) are what stand between a draft and the
  live site.

## Quality gates before publication

1. Official source readiness is checked before a guide brief or Writer call;
   weak candidates are skipped without model spend —
   `src/adapters/guide-fact-pack.ts`
2. Mechanical checks (word count, table count, duplicate headings) —
   `src/core/roles/editor.ts`
3. LLM editor pass — factual plausibility, tone, filler
4. 8-gram overlap ratio vs. source text ≤ 15% — `src/core/quality/overlap.ts`
5. Frontmatter validated against a zod schema mirroring
   `../src/content.config.ts`'s `posts` collection —
   `src/core/quality/frontmatter.ts`
6. The GitHub Actions workflow runs the site's full `pnpm build`
   (Astro check + build + font subsetting + Pagefind) after the agent
   runs; if it fails, nothing is committed.

Anything that fails review at any stage is skipped, not published, and
logged to `state/runs.jsonl` with the reason.

## State

- `state/seen.json` — source item ids already considered, so the same
  item isn't re-evaluated every 2 hours. Committed to the repo.
- `state/runs.jsonl` — one JSON line per run: what was published,
  rejected, and any errors. Used to enforce the daily news quota.

## Model configuration

All model choices live in `agent.config.ts` at the package root. Model
IDs on both OpenRouter's free tier and Google AI Studio change often —
verify the configured ids are still valid before relying on this in
production (see the comment at the top of that file for how).

## Topics

`topics.ts` at the package root is the AI/automation equivalent of
Metarotation's `games.ts`/`categories.ts` — the axis the planner uses to
find guide coverage gaps and the source of each topic's `officialUrl` for
guide grounding. Add a topic there (with a real docs/blog URL that has
enough prose for Readability to extract) to have the planner start
covering it.

## GitHub Actions

`.github/workflows/agent-news.yml` (every 2 hours, offset from
Metarotation's) and `agent-guide.yml` (daily), both also runnable manually
via "Run workflow". Add these repository secrets: `GEMINI_API_KEY`,
`OPENROUTER_API_KEY`, and optionally `REDDIT_CLIENT_ID` /
`REDDIT_CLIENT_SECRET` / `YOUTUBE_API_KEY`.
