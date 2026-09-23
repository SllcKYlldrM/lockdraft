import { createGuideBrief, planGuideCandidates } from "../roles/planner.ts";
import { writeGuideArticle } from "../roles/writer.ts";
import { reviewArticle } from "../roles/editor.ts";
import { buildGuideFactPack } from "../../adapters/guide-fact-pack.ts";
import { makeCover } from "../roles/artist.ts";
import { validateFrontmatter } from "../quality/frontmatter.ts";
import {
  loadTopics,
  loadCategories,
  loadExistingPosts,
} from "../../adapters/site-context.ts";
import { publishArticle } from "../../adapters/publisher/markdown-git.ts";
import { appendRun } from "../../adapters/run-log.ts";
import { emitAgentActivity } from "../../adapters/activity-log.ts";
import { limits, modelConfig } from "../../../agent.config.ts";
import type { RunSummary } from "../types.ts";

export interface GuideRunOptions {
  dryRun?: boolean;
}

export async function runGuidePipeline(opts: GuideRunOptions = {}): Promise<RunSummary> {
  const startedAt = new Date().toISOString();
  const runId = `guide-${startedAt}`;
  const emit = (
    workerId: string,
    workerName: string,
    status: "active" | "done" | "waiting" | "error",
    label: string,
    detail?: string,
  ) => emitAgentActivity({ runId, pipeline: "guide", workerId, workerName, status, label, detail });

  emit("guide", "Guide Agent", "active", "Guide pipeline started");
  const published: string[] = [];
  const rejected: { id: string; reason: string }[] = [];
  const errors: string[] = [];
  const notes: string[] = [];

  const [topicsList, categories, existingPosts] = await Promise.all([
    loadTopics(),
    loadCategories(),
    loadExistingPosts(),
  ]);
  const topicById = new Map(topicsList.map((t) => [t.id, t]));
  const knownTopicIds = topicsList.map((t) => t.id);
  const usedSlugs = new Set(existingPosts.map((p) => p.slug));

  try {
    emit("guide-planner", "Guide Planner", "active", "Finding the next topic and guide type gap");
    const candidates = planGuideCandidates(topicsList, categories, existingPosts);
    emit("guide-planner", "Guide Planner", "done", `Found ${candidates.length} guide candidate(s)`);
    if (candidates.length === 0) {
      const summary: RunSummary = {
        runId,
        pipeline: "guide",
        startedAt,
        finishedAt: new Date().toISOString(),
        published,
        rejected,
        errors: ["No content gap found — every (topic, guideType) pair is covered."],
        notes,
      };
      if (!opts.dryRun) await appendRun(summary);
      emit("guide", "Guide Agent", "waiting", "No content gap found", summary.errors[0]);
      return summary;
    }

    // Check source readiness before Writer. This prevents spending model
    // calls on a guide whose official page is unavailable or too thin.
    let candidate = candidates[0]!;
    let topic = candidate.topic ? topicById.get(candidate.topic) : undefined;
    emit("guide-fact-pack", "Guide Source Collector", "active", "Checking official source readiness");
    let factPack = await buildGuideFactPack(topic);
    emit("guide-fact-pack", "Guide Source Collector", factPack.sourceReady ? "done" : "waiting", factPack.sourceReason ?? "Official source ready");
    for (let index = 0; index < candidates.length && !factPack.sourceReady; index++) {
      notes.push(`Skipped ${candidate.topic ?? "unknown topic"} ${candidate.guideType} candidate: ${factPack.sourceReason ?? "source is not ready"}.`);
      const nextCandidate = candidates[index + 1];
      if (!nextCandidate) break;
      candidate = nextCandidate;
      topic = candidate.topic ? topicById.get(candidate.topic) : undefined;
      factPack = await buildGuideFactPack(topic);
    }
    if (!factPack.sourceReady) {
      notes.push("No guide candidate had a sufficiently rich official source; Writer was not called.");
      const summary: RunSummary = {
        runId,
        pipeline: "guide",
        startedAt,
        finishedAt: new Date().toISOString(),
        published,
        rejected,
        errors,
        notes,
      };
      if (!opts.dryRun) await appendRun(summary);
      emit("guide", "Guide Agent", "waiting", "Official source was not ready", notes.at(-1));
      return summary;
    }

    const brief = createGuideBrief(
      candidate,
      topic,
      categories.find((category) => category.id === candidate.category),
    );
    const relatedTitles = existingPosts
      .filter((p) => brief.relatedGuideSlugs.includes(p.slug))
      .map((p) => p.title);

    emit("guide-writer", "Guide Writer", "active", `Writing ${brief.workingTitle}`);
    let article = await writeGuideArticle(brief, topic, relatedTitles, factPack);
    emit("guide-writer", "Guide Writer", "done", `Drafted ${brief.workingTitle}`);
    emit("guide-editor", "Guide Editor", "active", `Reviewing ${brief.workingTitle}`);
    let verdict = await reviewArticle(article, factPack.verifiedText);
    emit("guide-editor", "Guide Editor", "done", "Initial review completed");

    let attempts = 0;
    while (verdict.status === "revise" && attempts < limits.maxRevisions) {
      emit("guide-writer", "Guide Writer", "active", `Revision ${attempts + 1}/${limits.maxRevisions}`);
      article = await writeGuideArticle(
        brief,
        topic,
        relatedTitles,
        factPack,
        verdict.issues,
      );
      emit("guide-writer", "Guide Writer", "done", `Revision ${attempts + 1} drafted`);
      emit("guide-editor", "Guide Editor", "active", "Reviewing revision");
      verdict = await reviewArticle(article, factPack.verifiedText);
      emit("guide-editor", "Guide Editor", "done", "Revision reviewed");
      attempts++;
    }

    const guideType = brief.guideType ?? "explainer";
    const needsDeepReview =
      attempts > 0 ||
      limits.deepReviewGuideTypes.includes(guideType as (typeof limits.deepReviewGuideTypes)[number]);
    if (verdict.status === "pass" && needsDeepReview) {
      emit("guide-reviewer", "Guide Deep Reviewer", "active", `Deep review: ${guideType}`);
      verdict = await reviewArticle(
        article,
        factPack.verifiedText,
        modelConfig.editor.guideQuality,
      );
      emit("guide-reviewer", "Guide Deep Reviewer", "done", "Deep review completed");
    }

    if (verdict.status !== "pass") {
      rejected.push({
        id: brief.workingTitle,
        reason: `editor: ${verdict.issues.join("; ")}`,
      });
    } else {
      if (usedSlugs.has(article.frontmatter.slug)) {
        article.frontmatter.slug = `${article.frontmatter.slug}-${Date.now().toString(36)}`;
      }

      const validation = validateFrontmatter("guides", article.frontmatter, knownTopicIds);
      if (!validation.valid) {
        rejected.push({ id: brief.workingTitle, reason: `frontmatter: ${validation.errors.join("; ")}` });
      } else {
        emit("guide-artist", "Guide Artist", "active", `Creating cover for ${article.frontmatter.title}`);
        const cover = await makeCover(article, {
          topicName: topic?.name,
        });
        emit("guide-artist", "Guide Artist", "done", `Cover result: ${cover.source}`);
        if (!cover.publicPath) {
          rejected.push({
            id: brief.workingTitle,
            reason: "cover: official image and AI cover generation both failed",
          });
        } else {
          article.frontmatter.cover = cover.publicPath;
          article.frontmatter.coverAlt = cover.alt;

          if (!opts.dryRun) {
            emit("guide-publisher", "Guide Publisher", "active", `Publishing ${article.frontmatter.slug}`);
            await publishArticle(article);
            emit("guide-publisher", "Guide Publisher", "done", `Published ${article.frontmatter.slug}`);
          }
          published.push(article.frontmatter.slug);
        }
      }
    }
  } catch (err) {
    errors.push(`guide pipeline: ${(err as Error).message}`);
    emit("guide", "Guide Agent", "error", "Guide pipeline failed", (err as Error).message);
  }

  const summary: RunSummary = {
    runId,
    pipeline: "guide",
    startedAt,
    finishedAt: new Date().toISOString(),
    published,
    rejected,
    errors,
    notes,
  };
  if (!opts.dryRun) await appendRun(summary);
  emit(
    "guide",
    "Guide Agent",
    errors.length > 0 ? "error" : "done",
    errors.length > 0 ? "Guide pipeline finished with errors" : "Guide pipeline completed",
  );
  return summary;
}
