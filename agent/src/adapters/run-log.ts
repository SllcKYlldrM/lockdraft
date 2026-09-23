import fs from "node:fs/promises";
import path from "node:path";
import { stateDir } from "../../agent.config.ts";
import type { RunSummary } from "../core/types.ts";

const RUNS_FILE = path.join(stateDir, "runs.jsonl");

export async function appendRun(summary: RunSummary): Promise<void> {
  await fs.mkdir(path.dirname(RUNS_FILE), { recursive: true });
  await fs.appendFile(RUNS_FILE, JSON.stringify(summary) + "\n", "utf-8");
}

/** Counts news articles published today (UTC) from the run log. */
export async function countNewsPublishedToday(): Promise<number> {
  let lines: string[];
  try {
    lines = (await fs.readFile(RUNS_FILE, "utf-8")).trim().split("\n").filter(Boolean);
  } catch {
    return 0;
  }
  const today = new Date().toISOString().slice(0, 10);
  let count = 0;
  for (const line of lines) {
    try {
      const summary = JSON.parse(line) as RunSummary;
      if (summary.pipeline === "news" && summary.startedAt.slice(0, 10) === today) {
        count += summary.published.length;
      }
    } catch {
      // skip malformed line
    }
  }
  return count;
}

/** Returns the completion time of the latest run that published news. */
export async function latestNewsPublicationAt(): Promise<string | undefined> {
  let lines: string[];
  try {
    lines = (await fs.readFile(RUNS_FILE, "utf-8")).trim().split("\n").filter(Boolean);
  } catch {
    return undefined;
  }

  let latest: string | undefined;
  for (const line of lines) {
    try {
      const summary = JSON.parse(line) as RunSummary;
      if (
        summary.pipeline === "news" &&
        summary.published.length > 0 &&
        (!latest || summary.finishedAt > latest)
      ) {
        latest = summary.finishedAt;
      }
    } catch {
      // skip malformed line
    }
  }
  return latest;
}
