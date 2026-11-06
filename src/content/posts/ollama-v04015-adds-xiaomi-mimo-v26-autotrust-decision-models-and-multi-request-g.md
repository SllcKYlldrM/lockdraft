---
title: >-
  Ollama v0.40.15 Adds Xiaomi MiMo V2.6, AutoTrust Decision Models, and
  Multi-Request GGUF Serving
published: 2026-11-06T12:33:26.018Z
draft: false
description: >-
  Ollama v0.40.15 adds Xiaomi MiMo V2.6, AutoTrust decision models on Apple
  silicon, and concurrent GGUF request handling.
tags:
  - Ollama
  - Open Source
  - AI Agents
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://github.com/ollama/ollama/releases/tag/v0.40.15'
---

## What changed

Ollama has released version 0.40.15, introducing support for new model architectures and expanding local execution capabilities:

- **Xiaomi MiMo V2.6**: Added support for `mimo-v2.6`, a 9-billion parameter model tailored for coding tasks and AI agent workflows.
- **AutoTrust Decision Models**: Integrated the `autotrust-jev` model family designed for direct decision evaluation. These models analyze text or images to return probabilities, ratings, and explicit choices using flags like `--ask`. The model sizes include 9b, 35b, and 27b-vl (with the 35b and 27b-vl variants supporting visual inputs). In this release, `autotrust-jev` is supported on Apple silicon.
- **Engine & Concurrency Updates**: Vision and recurrent GGUF models can now handle multiple concurrent requests simultaneously. The update also adds support for long-context scaling (YaRN) in Qwen3 and Qwen3.5 models.
- **Developer Workflows & Integrations**: The `ollama launch` command now supports Kimi Code CLI (the successor to `kimi-cli`) with automatic migration prompts for existing environments. It also automatically populates Pi's model selector and updates Claude Desktop to display exact Ollama model names.
- **CLI Behavior**: Running the `ollama` command without arguments now defaults to launching the interactive welcome screen.

## Why it matters

Concurrent request execution for vision and recurrent GGUF models allows local runtime environments to handle multi-agent queries or parallel pipeline steps without queuing bottlenecks. Adding dedicated decision models like AutoTrust provides structured binary and rated outputs without relying on complex JSON schemas or heavy prompt engineering.

Furthermore, precise model naming inside third-party interfaces like Claude Desktop and Pi simplifies hybrid local-and-cloud development setups. Practitioners balancing local runtimes with external API surfaces, such as those detailed in our guide to [architecting with Claude](/posts/architecting-with-claude-an-in-depth-developers-guide-to-anthropics-api-surface/), gain clearer visibility into local model selection.

## Limitations

Support for the `autotrust-jev` model family in version 0.40.15 is specifically noted for Apple silicon hardware. Additionally, multi-request concurrency in this release is restricted to recurrent and vision-based GGUF formats.

## What to do next

To run Xiaomi's new code and agent model, pull and execute it via the CLI:

```sh
ollama run mimo-v2.6
```

On Apple silicon hardware, test decision evaluation with AutoTrust by passing standard queries and an explicit question flag:

```sh
ollama run autotrust-jev "A customer says their card was charged twice." --ask "Is this a billing issue?"
```

Existing users running `kimi-cli` should execute `ollama launch` to trigger the automatic migration prompt to Kimi Code CLI.

## Sources

- [Ollama v0.40.15 Release Notes](https://github.com/ollama/ollama/releases/tag/v0.40.15)
