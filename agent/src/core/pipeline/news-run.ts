import { scout } from "../roles/scout.ts";
import { isBreakingNewsCandidate, planNews } from "../roles/planner.ts";
import { writeNewsArticle } from "../roles/writer.ts";
import { reviewArticle } from "../roles/editor.ts";
import { makeCover } from "../roles/artist.ts";
import { overlapRatio } from "../quality/overlap.ts";
import { validateFrontmatter } from "../quality/frontmatter.ts";
import { getSourceText } from "../article-fetcher.ts";
import { loadSeen, saveSeen } from "../../adapters/seen-store.ts";
import { loadRejections, saveRejections } from "../../adapters/rejection-store.ts";
import { loadTopics, loadExistingPosts } from "../../adapters/site-context.ts";
import { publishArticle } from "../../adapters/publisher/markdown-git.ts";
import {
  appendRun,
  countNewsPublishedToday,
  latestNewsPublicationAt,
} from "../../adapters/run-log.ts";
import { emitAgentActivity } from "../../adapters/activity-log.ts";
import { limits } from "../../../agent.config.ts";
import type { RunSummary } from "../types.ts";

export interface NewsRunOptions {
  dryRun?: boolean;
}

export async function runNewsPipeline(opts: NewsRunOptions = {}): Promise<RunSummary> {
  const startedAt = new Date().toISOString();
  const runId = `news-${startedAt}`;
  const emit = (
    workerId: string,
    workerName: string,
    status: "active" | "done" | "waiting" | "error",
    label: string,
    detail?: string,
  ) => emitAgentActivity({ runId, pipeline: "news", workerId, workerName, status, label, detail });

  emit("news", "News Agent", "active", "News pipeline started");
  const published: string[] = [];
  const rejected: { id: string; reason: string }[] = [];
  const errors: string[] = [];
  const notes: string[] = [];

  const [seen, rejections, topics, existingPosts, alreadyToday, latestPublicationAt] = await Promise.all([
    loadSeen(),
    loadRejections(),
    loadTopics(),
    loadExistingPosts(),
    countNewsPublishedToday(),
    latestNewsPublicationAt(),
  ]);
  const topicById = new Map(topics.map((t) => [t.id, t]));
  const knownTopicIds = topics.map((t) => t.id);
  const usedSlugs = new Set(existingPosts.map((p) => p.slug));
  const blockedIds = new Set([...seen, ...rejections.keys()]);

  let remainingQuota = Math.max(0, limits.maxNewsPerDay - alreadyToday);
  const newSeen = new Set(seen);

  console.log(
    `[news] daily quota: ${alreadyToday}/${limits.maxNewsPerDay} published today, ${remainingQuota} remaining`,
  );

  if (remainingQuota <= 0) {
    // Quota is already exhausted for today — skip scout/plan entirely so we
    // don't spend a free-tier LLM call (and outbound requests to every
    // source) on candidates we can't publish anyway. They'll still be
    // fresh (within newsLookbackHours) on the next run once quota resets.
    const note = `daily quota exhausted (${alreadyToday}/${limits.maxNewsPerDay}) — skipped scout/plan`;
    console.log(`[news] ${note}`);
    notes.push(note);
    emit("news", "News Agent", "waiting", "Daily quota exhausted", note);

    const summary: RunSummary = {
      runId,
      pipeline: "news",
      startedAt,
      finishedAt: new Date().toISOString(),
      published,
      rejected,
      errors,
      notes,
    };
    if (!opts.dryRun) await appendRun(summary);
    emit("news", "News Agent", "waiting", "Daily quota exhausted", note);
    return summary;
  }

  try {
    emit("news-scout", "News Scout", "active", "Collecting RSS, GitHub releases, Hacker News, Reddit and YouTube sources");
    const items = await scout(blockedIds);
    emit("news-scout", "News Scout", "done", `Collected ${items.length} fresh source item(s)`);
    const byKind = new Map<string, number>();
    for (const item of items) byKind.set(item.kind, (byKind.get(item.kind) ?? 0) + 1);
    console.log(
      `[news] scout found ${items.length} fresh item(s): ${
        [...byKind.entries()].map(([k, n]) => `${k}=${n}`).join(", ") || "none"
      }`,
    );

    emit("news-planner", "News Planner", "active", "Scoring and filtering news candidates");
    const candidates = await planNews(items);
    emit("news-planner", "News Planner", "done", `Kept ${candidates.length} candidate(s)`);
    console.log(
      `[news] planner kept ${candidates.length} candidate(s) above score threshold ${limits.newsScoreThreshold}: ${
        candidates.map((c) => `${c.item.id}(${c.score})`).join(", ") || "none"
      }`,
    );

    const breakingCandidate = candidates.some(isBreakingNewsCandidate);
    if (latestPublicationAt && !breakingCandidate) {
      const hoursSinceLast =
        (Date.now() - new Date(latestPublicationAt).getTime()) / 3_600_000;
      if (hoursSinceLast < limits.minHoursBetweenNews) {
        const note = `publish spacing active (${hoursSinceLast.toFixed(1)}h since last article; minimum ${limits.minHoursBetweenNews}h)`;
        console.log(`[news] ${note}`);
        notes.push(note);
        const summary: RunSummary = {
          runId,
          pipeline: "news",
          startedAt,
          finishedAt: new Date().toISOString(),
          published,
          rejected,
          errors,
          notes,
        };
        if (!opts.dryRun) await appendRun(summary);
        emit("news", "News Agent", "waiting", "Publish spacing is active", note);
        return summary;
      }
    }
    if (breakingCandidate) {
      const note = "breaking candidate bypassed normal publish spacing";
      console.log(`[news] ${note}`);
      notes.push(note);
    }

    for (const candidate of candidates) {
      if (remainingQuota <= 0 || published.length >= limits.maxNewsPerRun) break;

      try {
        const topic = candidate.item.topic ? topicById.get(candidate.item.topic) : undefined;
        const sourceText = await getSourceText(candidate.item);

        if (
          candidate.item.kind === "youtube" &&
          sourceText.trim().length < limits.minYoutubeSourceChars
        ) {
          // We only ever have the video's title + description (no
          // transcript) — too thin a description gives the writer
          // nothing but room to invent specifics. Skip before spending
          // a writer/editor LLM call on it.
          rejections.set(candidate.item.id, {
            retryAfter: new Date(
              Date.now() + limits.rejectionRetryHours * 60 * 60 * 1000,
            ).toISOString(),
            reason: `youtube description too thin (${sourceText.trim().length} chars, needs ${limits.minYoutubeSourceChars})`,
          });
          rejected.push({
            id: candidate.item.id,
            reason: `youtube description too thin (${sourceText.trim().length} chars, needs ${limits.minYoutubeSourceChars}) — skipped before writing`,
          });
          continue;
        }

        emit("news-writer", "News Writer", "active", `Writing ${candidate.item.title}`);
        let article = await writeNewsArticle(candidate, topic);
        emit("news-writer", "News Writer", "done", `Drafted ${candidate.item.title}`);
        emit("news-editor", "News Editor", "active", `Reviewing ${candidate.item.title}`);
        let verdict = await reviewArticle(article, sourceText);
        emit("news-editor", "News Editor", "done", `Reviewed ${candidate.item.title}`);
        let overlap = overlapRatio(article.body, sourceText);

        let attempts = 0;
        while (
          (verdict.status === "revise" || overlap > limits.maxOverlapRatio) &&
          attempts < limits.maxRevisions
        ) {
          const issues = [...verdict.issues];
          if (overlap > limits.maxOverlapRatio) {
            issues.push("Body text overlaps too closely with the source — rewrite fully in your own words.");
          }
          emit("news-writer", "News Writer", "active", `Revision ${attempts + 1}/${limits.maxRevisions}`);
          article = await writeNewsArticle(candidate, topic, issues);
          emit("news-writer", "News Writer", "done", `Revision ${attempts + 1} drafted`);
          emit("news-editor", "News Editor", "active", "Reviewing revision");
          verdict = await reviewArticle(article, sourceText);
          emit("news-editor", "News Editor", "done", "Revision reviewed");
          overlap = overlapRatio(article.body, sourceText);
          attempts++;
        }

        if (verdict.status !== "pass" || overlap > limits.maxOverlapRatio) {
          // Content-quality rejection is cooled down rather than added to
          // seen.json, so a later run can retry it after the source/model
          // conditions have changed.
          const reason = overlap > limits.maxOverlapRatio
            ? `overlap ratio ${overlap.toFixed(2)} exceeds limit`
            : `editor: ${verdict.issues.join("; ")}`;
          rejections.set(candidate.item.id, {
            retryAfter: new Date(
              Date.now() + limits.rejectionRetryHours * 60 * 60 * 1000,
            ).toISOString(),
            reason,
          });
          rejected.push({
            id: candidate.item.id,
            reason: overlap > limits.maxOverlapRatio
              ? `overlap ratio ${overlap.toFixed(2)} exceeds limit`
              : `editor: ${verdict.issues.join("; ")}`,
          });
          continue;
        }

        if (usedSlugs.has(article.frontmatter.slug)) {
          article.frontmatter.slug = `${article.frontmatter.slug}-${Date.now().toString(36)}`;
        }

        const validation = validateFrontmatter("news", article.frontmatter, knownTopicIds);
        if (!validation.valid) {
          rejections.set(candidate.item.id, {
            retryAfter: new Date(
              Date.now() + limits.rejectionRetryHours * 60 * 60 * 1000,
            ).toISOString(),
            reason: `frontmatter: ${validation.errors.join("; ")}`,
          });
          rejected.push({ id: candidate.item.id, reason: `frontmatter: ${validation.errors.join("; ")}` });
          continue;
        }

        emit("news-artist", "News Artist", "active", `Creating cover for ${article.frontmatter.title}`);
        const cover = await makeCover(article, {
          sourceUrl: candidate.item.sourceUrl,
          topicName: topic?.name,
        });
        emit("news-artist", "News Artist", "done", `Cover result: ${cover.source}`);
        if (!cover.publicPath) {
          const reason = "cover: official image and AI cover generation both failed";
          rejections.set(candidate.item.id, {
            retryAfter: new Date(
              Date.now() + limits.rejectionRetryHours * 60 * 60 * 1000,
            ).toISOString(),
            reason,
          });
          rejected.push({ id: candidate.item.id, reason });
          continue;
        }
        article.frontmatter.cover = cover.publicPath;
        article.frontmatter.coverAlt = cover.alt;

        if (!opts.dryRun) {
          emit("news-publisher", "News Publisher", "active", `Publishing ${article.frontmatter.slug}`);
          await publishArticle(article);
          emit("news-publisher", "News Publisher", "done", `Published ${article.frontmatter.slug}`);
        }
        newSeen.add(candidate.item.id);
        rejections.delete(candidate.item.id);
        published.push(article.frontmatter.slug);
        usedSlugs.add(article.frontmatter.slug);
        remainingQuota--;
      } catch (err) {
        // Infra/provider failure (writer or editor call threw) — do NOT
        // mark as seen, so this candidate is reconsidered on a later run
        // once the provider recovers.
        errors.push(`${candidate.item.id}: ${(err as Error).message}`);
      }
    }
  } catch (err) {
    errors.push(`scout/plan: ${(err as Error).message}`);
    emit("news", "News Agent", "error", "News pipeline failed", (err as Error).message);
  }

  if (!opts.dryRun) {
    await saveSeen(newSeen);
    await saveRejections(rejections);
  }

  const summary: RunSummary = {
    runId,
    pipeline: "news",
    startedAt,
    finishedAt: new Date().toISOString(),
    published,
    rejected,
    errors,
    notes,
  };
  if (!opts.dryRun) await appendRun(summary);
  emit(
    "news",
    "News Agent",
    errors.length > 0 ? "error" : "done",
    errors.length > 0 ? "News pipeline finished with errors" : "News pipeline completed",
  );
  return summary;
}
