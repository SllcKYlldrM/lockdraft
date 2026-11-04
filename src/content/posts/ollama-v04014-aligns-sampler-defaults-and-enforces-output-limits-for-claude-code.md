---
title: >-
  Ollama v0.40.14 Aligns Sampler Defaults and Enforces Output Limits for Claude
  Code
published: 2026-11-04T12:37:39.242Z
draft: false
description: >-
  Ollama v0.40.14 updates OpenAI-compatible sampler defaults, respects Claude
  output token limits, and speeds up MLX top-k sampling.
tags:
  - Ollama
  - Open Source
  - AI Agents
  - Developer Tools
  - ai-news
  - open-source-llms
category: AI News
author: LockDraft
sourceLink: 'https://github.com/ollama/ollama/releases/tag/v0.40.14'
---

## What changed

Ollama v0.40.14 delivers several targeted fixes across API handling, command-line tooling, and backend execution:

* **Output token caps for Claude Code:** The command `ollama launch claude` now uses the model's explicit output token limit, ensuring cloud models are no longer constrained by the previous 128k default cap on outputs.
* **OpenAI endpoint sampler parity:** OpenAI-compatible API routes no longer fall back to `1.0` for missing `temperature` or `top_p` values. Requests omitting these parameters now inherit the model's packaged default samplers, matching the native `/api/chat` behavior.
* **Payload decoding and context preservation:** Cloud web search responses returned via `/api/chat` are now correctly decoded, including compressed payloads. The `/v1/responses` route now preserves readable input structure and past assistant refusals instead of flattening the prompt history.
* **Routing and stability:** The Ollama desktop app automatically retries disconnected ChatGPT sessions. Additionally, `ollama launch codex` checks ChatGPT routing prior to setting up configuration and returns explicit error messaging if the route is offline.
* **MLX sampling speedups:** Top-k sampling performance on MLX backends has been optimized for models with large vocabulary sizes.

## Why it matters

Implicit parameter overrides can lead to unexpected output variance. Previously, clients sending requests without explicit sampler arguments to OpenAI-compatible endpoints received forced `1.0` values, overriding model-specific tuning. Standardizing parameter resolution across both native and OpenAI endpoints provides predictable generation outputs.

Respecting model output limits in `ollama launch claude` prevents long generation tasks from terminating prematurely against an artificial 128k default cap. This fix is particularly relevant for agentic developer workflows running on [Claude Code](/posts/claude-code-background-agent-summaries-burn-up-to-20percent-of-token-budgets/). Meanwhile, maintaining unflattened context and explicit refusal history in `/v1/responses` prevents conversation context degradation across complex multi-turn API calls.

## What to do next

Update your local deployment to Ollama v0.40.14. If your integration relies on OpenAI-compatible endpoints and expects an implicit `1.0` default for `temperature` or `top_p`, update your client request bodies to send those values explicitly. Otherwise, your requests will now default to the underlying model's embedded parameters.

## Sources

* [Ollama v0.40.14 Release Notes](https://github.com/ollama/ollama/releases/tag/v0.40.14)
