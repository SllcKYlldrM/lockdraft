import fs from "node:fs/promises";
import path from "node:path";
import { stateDir } from "../../agent.config.ts";

const SEEN_FILE = path.join(stateDir, "seen.json");

interface SeenState {
  ids: string[];
}

export async function loadSeen(): Promise<Set<string>> {
  try {
    const raw = JSON.parse(await fs.readFile(SEEN_FILE, "utf-8")) as SeenState;
    return new Set(raw.ids);
  } catch {
    return new Set();
  }
}

/** Persists the seen set, capped to the most recent 5000 ids. */
export async function saveSeen(ids: Set<string>): Promise<void> {
  await fs.mkdir(path.dirname(SEEN_FILE), { recursive: true });
  const capped = [...ids].slice(-5000);
  await fs.writeFile(SEEN_FILE, JSON.stringify({ ids: capped }, null, 2));
}
