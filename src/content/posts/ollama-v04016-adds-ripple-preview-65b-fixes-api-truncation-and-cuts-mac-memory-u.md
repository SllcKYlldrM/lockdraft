---
title: >-
  Ollama v0.40.16 Adds Ripple Preview 65B, Fixes API Truncation, and Cuts Mac
  Memory Use
published: 2026-11-10T03:01:17.448Z
draft: false
description: >-
  Ollama v0.40.16 adds Ricursive Intelligence's Ripple Preview 65B model, fixes
  API endpoints, and saves 27 GiB memory for Qwen3.8 Flash Next on Mac.
tags:
  - Ollama
  - Open Source LLMs
  - AI Agents
  - Developer Tools
  - ai-news
  - open-source-llms
category: AI News
author: LockDraft
sourceLink: 'https://github.com/ollama/ollama/releases/tag/v0.40.16'
---

## What changed

Ollama released version v0.40.16, introducing support for Ripple Preview, a 65B dense model built by Ricursive Intelligence targeting agentic coding tasks. The model can be run locally using `ollama run ripple-preview`.

The update includes several hardware and API modifications:

- **Memory Reduction on Apple Silicon**: Running Qwen3.8 Flash Next on Mac hardware now consumes approximately 27 GiB less memory.
- **API Behavior Fixes**: The `/v1/responses` endpoint now respects the `truncation` parameter and no longer truncates response payloads silently by default. Meanwhile, `/v1/models` returns an empty array `[]` instead of `null` when no local models are installed.
- **Tooling and Integration Updates**: Executing `ollama launch claude` now reliably forwards Claude Code requests to the chosen model. Additionally, `ollama launch` displays an explanatory message whenever a selected cloud model has been retired.
- **Platform & Runtime Updates**: Added CUDA 13.5 support for Windows on ARM, alongside an updated build of the underlying `llama.cpp` engine.

## Why it matters

For developers executing agentic coding workflows locally, Ricursive Intelligence's 65B dense model brings another specialized parameter option to the Ollama library. 

The API modifications resolve subtle client-side bugs for integrations relying on OpenAI-compatible endpoints. By ending silent default truncation on `/v1/responses`, Ollama avoids unexpected text cuts during long code generation tasks. Correcting `/v1/models` to return an empty list rather than `null` prevents type error exceptions in client SDKs parsing missing local models.

Memory footprint cuts of 27 GiB for Qwen3.8 Flash Next on Apple silicon significantly reduce VRAM pressure, making high-parameter models easier to host alongside developer tools. Furthermore, enforcing consistent model targets in `ollama launch claude` provides better routing reliability for users working with workflows like [Claude Code](/posts/claude-code-background-agent-summaries-burn-up-to-20percent-of-token-budgets/).

## What to do next

To update to the latest release and test the new model:

1. Upgrade Ollama to version v0.40.16 via your installation manager.
2. Execute `ollama run ripple-preview` to download and evaluate the 65B agentic coding model.
3. Verify downstream API integrations using `/v1/responses` to ensure any custom truncation rules align with the new explicit parameter behavior.

*Caveats*: Because Ripple Preview is a 65B dense model, hardware with significant memory capacity is required to achieve playable inference speeds. Early preview status means performance and agent behavior may evolve in future model revisions.

## Sources
- [Ollama v0.40.16 Release Notes](https://github.com/ollama/ollama/releases/tag/v0.40.16)
