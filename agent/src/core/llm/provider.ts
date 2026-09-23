import { modelConfig, limits } from "../../../agent.config.ts";
import type { Role } from "../types.ts";

export interface ChatMessage {
  role: "system" | "user";
  content: string;
}

export interface ModelRef {
  provider: "openrouter" | "gemini";
  model: string;
}

const RETRYABLE_STATUS = new Set([404, 408, 409, 429, 500, 502, 503, 504]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Free-tier APIs cap requests per minute, not just per day — a single run
// can easily fire off a dozen calls in a few seconds (writer + editor per
// candidate, across several candidates). Space calls out per provider so
// we don't self-inflict 429s before the retry/fallback logic even kicks in.
// OpenRouter's free-model cap is ~20 req/min regardless of account
// balance — 3.2s spacing keeps a safe margin under that (~18.75/min).
const MIN_INTERVAL_MS: Record<ModelRef["provider"], number> = {
  gemini: 4500,
  openrouter: 3200,
};
const lastCallAt: Partial<Record<ModelRef["provider"], number>> = {};

async function throttle(provider: ModelRef["provider"]): Promise<void> {
  const minInterval = MIN_INTERVAL_MS[provider];
  const last = lastCallAt[provider] ?? 0;
  const wait = last + minInterval - Date.now();
  if (wait > 0) await sleep(wait);
  lastCallAt[provider] = Date.now();
}

async function callOpenRouter(
  model: string,
  messages: ChatMessage[],
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://lockdraft.com",
      "X-OpenRouter-Title": "LockDraft",
      // Keep the legacy header for older OpenRouter analytics paths.
      "X-Title": "LockDraft",
    },
    body: JSON.stringify({ model, messages, temperature: 0.7 }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = new Error(
      `OpenRouter ${model} failed: ${res.status} ${body.slice(0, 300)}`,
    ) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error(`OpenRouter ${model} returned no content`);
  return content;
}

async function callGemini(
  model: string,
  messages: ChatMessage[],
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const system = messages.find((m) => m.role === "system")?.content;
  const contents = messages
    .filter((m) => m.role === "user")
    .map((m) => ({ role: "user", parts: [{ text: m.content }] }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        generationConfig: { temperature: 0.7 },
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = new Error(
      `Gemini ${model} failed: ${res.status} ${body.slice(0, 300)}`,
    ) as Error & { status?: number; quotaExceeded?: boolean };
    err.status = res.status;
    err.quotaExceeded = res.status === 429 && /quota|rate.?limit/i.test(body);
    throw err;
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("");
  if (!text) throw new Error(`Gemini ${model} returned no content`);
  return text;
}

async function callModel(ref: ModelRef, messages: ChatMessage[]): Promise<string> {
  const call = ref.provider === "openrouter" ? callOpenRouter : callGemini;
  let lastErr: unknown;
  for (let attempt = 0; attempt < limits.llmRetries; attempt++) {
    try {
      await throttle(ref.provider);
      return await call(ref.model, messages);
    } catch (err) {
      lastErr = err;
      const typedErr = err as { status?: number; quotaExceeded?: boolean };
      const status = typedErr.status;
      // A project quota error will not be fixed by retrying the same Gemini
      // model. Move immediately to the next provider/model in the chain.
      if (typedErr.quotaExceeded) break;
      const retryable = status === undefined || RETRYABLE_STATUS.has(status);
      if (!retryable || attempt === limits.llmRetries - 1) break;
      await sleep(500 * 2 ** attempt);
    }
  }
  throw lastErr;
}

/**
 * Calls the configured model chain for `role`, falling back through the
 * secondary Gemini model and then the pinned low-cost OpenRouter models. Throws if
 * all configured models fail — callers must handle by skipping the item.
 */
export async function callLLM(
  role: Exclude<Role, "artist">,
  messages: ChatMessage[],
  primaryOverride?: ModelRef,
): Promise<string> {
  const cfg = modelConfig[role];
  const models = [
    primaryOverride ?? cfg.primary,
    cfg.fallback,
    cfg.emergencyFallback,
    cfg.lastResortFallback,
  ].filter((model): model is ModelRef => Boolean(model));
  const failures: unknown[] = [];

  for (const model of models) {
    try {
      return await callModel(model, messages);
    } catch (err) {
      failures.push(err);
    }
  }

  const details = models
    .map((model, index) => `${model.model}: ${(failures[index] as Error)?.message ?? String(failures[index])}`)
    .join(" | ");
  throw new AggregateError(failures, `All ${role} models failed — ${details}`);
}

/**
 * Generates an image via the configured artist model. Returns raw bytes
 * (PNG) or undefined if generation is unavailable/fails. The publishing
 * pipelines treat an undefined result as a blocking cover failure.
 */
async function generateGeminiImage(prompt: string): Promise<Buffer | undefined> {
  const cfg = modelConfig.artist;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || cfg.primary.provider !== "gemini") return undefined;

  const retryDelays = [5_000, 15_000];
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await throttle("gemini");
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${cfg.primary.model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(45_000),
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          }),
        },
      );
      if (!res.ok) {
        if (![429, 500, 502, 503, 504].includes(res.status)) return undefined;
        throw new Error(`Gemini image returned ${res.status}`);
      }
      const data = (await res.json()) as {
        candidates?: {
          content?: { parts?: { inlineData?: { data?: string } }[] };
        }[];
      };
      const b64 = data.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData?.data,
      )?.inlineData?.data;
      if (b64) return Buffer.from(b64, "base64");
    } catch {
      if (attempt < retryDelays.length) await sleep(retryDelays[attempt] ?? 15_000);
    }
  }
  return undefined;
}

/**
 * Anonymous AI Horde fallback. It is free but queued at lower priority, so
 * this intentionally runs only after Gemini retries have failed.
 */
async function generateAiHordeImage(prompt: string): Promise<Buffer | undefined> {
  try {
    const submit = await fetch("https://stablehorde.net/api/v2/generate/async", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "0000000000",
      },
      signal: AbortSignal.timeout(20_000),
      body: JSON.stringify({
        prompt,
        params: { width: 1024, height: 576, steps: 20, n: 1 },
        nsfw: false,
        censor_nsfw: true,
      }),
    });
    if (!submit.ok) return undefined;
    const queued = (await submit.json()) as { id?: string };
    if (!queued.id) return undefined;

    const deadline = Date.now() + 120_000;
    while (Date.now() < deadline) {
      await sleep(5_000);
      const statusRes = await fetch(
        `https://stablehorde.net/api/v2/generate/status/${queued.id}`,
        { signal: AbortSignal.timeout(15_000) },
      );
      if (!statusRes.ok) return undefined;
      const status = (await statusRes.json()) as {
        done?: boolean;
        faulted?: boolean;
        generations?: { img?: string }[];
      };
      if (status.faulted) return undefined;
      if (!status.done) continue;
      const imageUrl = status.generations?.[0]?.img;
      if (!imageUrl) return undefined;
      const imageRes = await fetch(imageUrl, { signal: AbortSignal.timeout(30_000) });
      if (!imageRes.ok) return undefined;
      return Buffer.from(await imageRes.arrayBuffer());
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export async function generateImage(prompt: string): Promise<Buffer | undefined> {
  return (await generateGeminiImage(prompt)) ?? (await generateAiHordeImage(prompt));
}
