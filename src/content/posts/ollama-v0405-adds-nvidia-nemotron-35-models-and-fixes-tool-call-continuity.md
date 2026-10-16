---
title: Ollama v0.40.5 Adds NVIDIA Nemotron 3.5 Models and Fixes Tool Call Continuity
published: 2026-10-16T05:14:44.837Z
draft: false
description: >-
  Ollama v0.40.5 releases NVIDIA Nemotron 3.5 Super and Bolt, adds cloud
  decision models, fixes OpenAI Responses tool call breaks, and improves cloud
  error report
tags:
  - Ollama
  - model-release
  - ai-agents
  - ai-news
  - open-source-llms
category: AI News
author: LockDraft
sourceLink: 'https://github.com/ollama/ollama/releases/tag/v0.40.5'
---

## What changed

Ollama v0.40.5 introduces two NVIDIA Nemotron models and enhances cloud integration stability.

**NVIDIA Nemotron 3.5 Super** is now available via `ollama run nemotron-3.5-super`. This vision-language model utilizes a 120-billion-parameter hybrid Mamba-2/Transformer mixture-of-experts backbone with 12 billion active parameters per token. It incorporates a C-RADIO vision encoder and supports context windows up to 1 million tokens. The model supports coding, reasoning, tool calling, and document understanding, featuring an adjustable on/off thinking mode.

A compressed variant, **Nemotron 3.5 Bolt** (`ollama run nemotron-3.5-bolt`), reduces the footprint to 74 billion total parameters with 9 billion active. It includes a built-in drafter for speculative decoding and is optimized to fit within 24 GB of VRAM, targeting everyday agentic workloads on constrained hardware.

The release expands cloud execution options by adding decision models accessible without local downloads. Users can invoke `clef:cloud` and `clef-flash:cloud` to route requests through ollama.com.

Bug fixes address OpenAI-compatible Responses conversations containing custom tool calls, which previously failed when continued. Error reporting in the desktop app now provides clearer diagnostics for cloud access failures, distinguishing between sign-in issues, payment problems, and upstream errors from the ChatGPT gateway. The update also upgrades llama.cpp to support Nemotron 3.5 architectures and updates MLX.

## Why it matters

Nemotron 3.5 Super brings a high-capacity MoE model with long-context vision capabilities to local deployment, suitable for complex document analysis and tool-rich environments. The hybrid architecture targets efficient inference over massive context windows. Nemotron 3.5 Bolt lowers the hardware barrier for agentic applications by reducing active parameters and utilizing speculative decoding, enabling performance on single GPUs with 24 GB of memory.

Resolving the failure in OpenAI-compatible Responses conversations with custom tool calls removes a blocking issue for developers constructing multi-step agents that require tool definitions to persist across turns. Cloud-run decision models allow teams to offload routing logic without managing local compute for specialized models. Improved error granularity for cloud failures helps practitioners quickly identify authentication, billing, or gateway issues rather than encountering opaque exceptions.

## What to do next

Update Ollama to v0.40.5 to access the new models and fixes. Retrieve the models using:

```bash
ollama pull nemotron-3.5-super
ollama pull nemotron-3.5-bolt
```

Test cloud decision models with `ollama run clef:cloud`. If using the desktop app, review the enhanced error messages for cloud connectivity issues to diagnose sign-in or payment configuration problems.

## Limitations

Nemotron 3.5 Bolt is tuned for systems with at least 24 GB of VRAM. Cloud-based decision models require active internet connectivity and valid ollama.com credentials; availability may depend on account standing and usage policies.

Sources:
[Ollama v0.40.5 Release](https://github.com/ollama/ollama/releases/tag/v0.40.5)

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).

## Sources

- [Official source](https://github.com/ollama/ollama/releases/tag/v0.40.5)
