---
title: >-
  Ollama v0.40.9 Adds Local Audio Synthesis, d3 Decision Models, and
  Cross-Platform Flint
published: 2026-10-23T20:07:52.419Z
draft: false
description: >-
  Ollama v0.40.9 introduces Apple Silicon speech synthesis via Phonon, d3
  decision models, cross-platform Flint support, and API streaming fixes.
tags:
  - Ollama
  - Open Source
  - LLM
  - ai-news
  - open-source-llms
  - tool-update
category: AI News
author: LockDraft
sourceLink: 'https://github.com/ollama/ollama/releases/tag/v0.40.9'
---

## What changed

Ollama version 0.40.9 introduces localized speech generation, specialized routing models, expanded platform support for existing library models, and critical fixes for API streaming endpoints.

Key additions include:

- **Speech Synthesis with Phonon:** Users running macOS on Apple Silicon can now generate real-time audio output. The `ollama run` command streams synthesized speech directly through system audio as text or response tokens generate. External software can consume this stream via an OpenAI-compatible `/v1/audio/speech` endpoint.
- **`d3` Decision Model Family:** Ollama has integrated the `d3` series—derived from vLLM Semantic Router—into its model registry. Available in 2B, 4B, 9B, and 27B parameter counts, these models analyze text, structured state representations, or visual inputs to classify inputs, answer boolean questions, or generate option probability scores (e.g., using `ollama run d3 "..." --ask "Is this a billing issue?"`).
- **Cross-Platform Flint Support:** The `Flint` model library entry, previously limited to macOS, is now available on Linux and Windows.
- **API and Launch Reliability Upgrades:** 
  - Streaming connections using OpenAI Responses and Anthropic Messages compatibility protocols now surface mid-generation failures explicitly instead of quietly dropping the connection after partial responses.
  - The `ollama launch` command now correctly feeds cloud model context boundaries and functional specs to connected development tools, preventing incorrect context compaction.
  - Web search flows integrated with Anthropic-compatible endpoints now maintain the model's configured thinking parameter across follow-up requests.

## Why it matters

Direct support for audio generation on Apple Silicon allows developers to prototype voice-enabled local applications without introducing third-party text-to-speech dependencies or external network latency. Providing an OpenAI-style `/v1/audio/speech` path means existing speech integrations can point directly to a local Ollama instance.

For agentic workflows and request routing, the `d3` suite provides dedicated, lightweight classification engines spanning four model scales. Rather than prompting standard instruct models to perform rigid categorization, developers can offload triage, guardrails, and branching decisions to specialized models designed for fast, probabilistic scoring.

Additionally, explicitly raising streaming generation failures addresses silent dropouts in production workflows—a critical fix for developers integrating Ollama alongside broader LLM pipelines like [Anthropic's API surface](/posts/architecting-with-claude-an-in-depth-developers-guide-to-anthropics-api-surface/).

## Limitations

Native speech synthesis via Phonon is currently constrained to Apple Silicon hardware, leaving Windows and Linux environments without built-in TTS capabilities in this release.

## What to do next

Update your local Ollama installation to version 0.40.9. If you are on Apple Silicon, you can test speech generation immediately from your terminal:

```sh
ollama run phonon "Hello from Ollama."
```

To evaluate decision and routing models for workflow classification, pull any size of the `d3` family (2B through 27B) from the Ollama library.

## Sources

- [Ollama v0.40.9 Release Notes](https://github.com/ollama/ollama/releases/tag/v0.40.9)
