import { runNewsPipeline } from "./core/pipeline/news-run.ts";
import { runGuidePipeline } from "./core/pipeline/guide-run.ts";
import { runPromptPipeline } from "./core/pipeline/prompt-run.ts";

const command = process.argv[2];

function printSummary(summary: {
  pipeline: string;
  published: string[];
  rejected: { id: string; reason: string }[];
  errors: string[];
  notes: string[];
}): void {
  console.log(`\n=== ${summary.pipeline} run summary ===`);
  console.log(`Published (${summary.published.length}): ${summary.published.join(", ") || "none"}`);
  if (summary.rejected.length > 0) {
    console.log(`Rejected (${summary.rejected.length}):`);
    for (const r of summary.rejected) console.log(`  - ${r.id}: ${r.reason}`);
  }
  if (summary.notes.length > 0) {
    console.log(`Notes (${summary.notes.length}):`);
    for (const n of summary.notes) console.log(`  - ${n}`);
  }
  if (summary.errors.length > 0) {
    console.log(`Errors (${summary.errors.length}):`);
    for (const e of summary.errors) console.log(`  - ${e}`);
  }
}

async function main() {
  switch (command) {
    case "news": {
      const summary = await runNewsPipeline();
      printSummary(summary);
      // Per-candidate errors (a source item that failed, a provider that
      // was briefly rate-limited) are expected and already recorded in
      // the summary/runs.jsonl — do NOT fail the process for those, or
      // the calling GitHub Actions workflow would skip committing the
      // articles that DID succeed in this same run. Only a genuinely
      // empty run with errors and nothing else to show is worth flagging.
      if (
        summary.errors.length > 0 &&
        summary.published.length === 0 &&
        summary.rejected.length === 0
      ) {
        process.exitCode = 1;
      }
      break;
    }
    case "guide": {
      const summary = await runGuidePipeline();
      printSummary(summary);
      if (
        summary.errors.length > 0 &&
        summary.published.length === 0 &&
        summary.rejected.length === 0
      ) {
        process.exitCode = 1;
      }
      break;
    }
    case "prompt": {
      const summary = await runPromptPipeline();
      printSummary(summary);
      if (
        summary.errors.length > 0 &&
        summary.published.length === 0 &&
        summary.rejected.length === 0
      ) {
        process.exitCode = 1;
      }
      break;
    }
    case "dry-run": {
      const news = await runNewsPipeline({ dryRun: true });
      printSummary(news);
      const guide = await runGuidePipeline({ dryRun: true });
      printSummary(guide);
      const prompt = await runPromptPipeline({ dryRun: true });
      printSummary(prompt);
      console.log("\n(dry run — no files were written, no state was saved)");
      break;
    }
    default:
      console.error(`Unknown command "${command}". Use: news | guide | prompt | dry-run`);
      process.exitCode = 1;
  }
}

main()
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exitCode = 1;
  })
  .finally(() => {
    // The pipelines make many fetch() calls (LLM providers, RSS, GitHub,
    // Hacker News); undici's keep-alive connection pool can leave sockets
    // open well past the last response, which stalls Node's natural exit
    // for minutes in CI. All work is done and every result is already
    // printed/written by this point, so force the exit instead of waiting
    // for the event loop to drain on its own.
    process.exit(process.exitCode ?? 0);
  });
