import fs from "node:fs/promises";
import path from "node:path";
import { stateDir } from "../../agent.config.ts";

const REJECTIONS_FILE = path.join(stateDir, "rejections.json");

export interface RejectionEntry {
  retryAfter: string;
  reason: string;
}

export async function loadRejections(): Promise<Map<string, RejectionEntry>> {
  try {
    const raw = JSON.parse(await fs.readFile(REJECTIONS_FILE, "utf-8")) as {
      items?: Record<string, RejectionEntry>;
    };
    const now = Date.now();
    return new Map(
      Object.entries(raw.items ?? {}).filter(([, entry]) =>
        Number.isFinite(Date.parse(entry.retryAfter)) &&
        Date.parse(entry.retryAfter) > now,
      ),
    );
  } catch {
    return new Map();
  }
}

export async function saveRejections(
  entries: Map<string, RejectionEntry>,
): Promise<void> {
  await fs.mkdir(path.dirname(REJECTIONS_FILE), { recursive: true });
  const capped = [...entries.entries()].slice(-1000);
  await fs.writeFile(
    REJECTIONS_FILE,
    JSON.stringify({ items: Object.fromEntries(capped) }, null, 2),
    "utf-8",
  );
}
