import fs from "node:fs";
import path from "node:path";
import { stateDir } from "../../agent.config.ts";

export type AgentActivityStatus = "active" | "done" | "waiting" | "error";

export interface AgentActivityEvent {
  eventId: string;
  runId: string;
  pipeline: "news" | "guide" | "prompt";
  workerId: string;
  workerName: string;
  status: AgentActivityStatus;
  label: string;
  timestamp: string;
  detail?: string;
}

const ACTIVITY_FILE = path.join(stateDir, "agent-activity.jsonl");

/** Append-only, local-only agent-run telemetry (not read by the site). */
export function emitAgentActivity(
  event: Omit<AgentActivityEvent, "eventId" | "timestamp">,
): void {
  fs.mkdirSync(path.dirname(ACTIVITY_FILE), { recursive: true });
  const record: AgentActivityEvent = {
    ...event,
    eventId: `${event.runId}:${event.workerId}:${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  fs.appendFileSync(ACTIVITY_FILE, `${JSON.stringify(record)}\n`, "utf-8");
}
