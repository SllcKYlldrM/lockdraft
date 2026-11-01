---
title: Ollama v0.40.12 Adds Liquid AI LFM3 Family and d1 2B Decision Models
published: 2026-11-01T15:30:17.834Z
draft: false
description: >-
  Ollama v0.40.12 adds Liquid AI LFM3 and d1 2B model families, faster prompt
  processing on Apple silicon, and MLX speculative decoding support.
tags:
  - Ollama
  - open-source-llms
  - ai-agents
  - ai-news
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://github.com/ollama/ollama/releases/tag/v0.40.12'
---

## What changed

Ollama released version 0.40.12, introducing support for Liquid AI's LFM3 architecture and d1 decision models alongside backend performance optimizations for Apple silicon.

### Liquid AI LFM3 Model Family
Liquid AI's new LFM3 models use a tri-hybrid architecture optimized for local autonomous agents, structured outputs, and tool integration. The release brings four variants to Ollama:

- **`lfm3`**: A 1.7-billion parameter text-only model featuring a 256,000-token context window (`ollama run lfm3`).
- **`lfm3-vl`**: Extends the base architecture with vision capabilities for image context.
- **`lfm3-audio`**: Provides speech-to-text recognition, text-to-speech synthesis, and audio translation across 18 languages.
- **`lfm3-omni`**: Unifies text, visual, and audio modalities into a single local model.

### Liquid AI d1 Decision Models
Built on top of LFM3, Liquid AI's `d1` line consists of 2-billion parameter models designed specifically to evaluate context and make targeted operational choices:

- **`d1`**: Evaluates decisions based on text and image inputs.
- **`d1-omni`**: Incorporates audio context into decision tasks.

Developers can query `d1` models directly from the command line, for example:
```sh
ollama run d1:2b "I was charged twice for order 4417." --ask "Is this a billing issue?"
```

### Additional System Updates
- **Apple Silicon Acceleration**: Increased prompt processing speeds on Apple silicon for Gemma 4, Flint, and Laguna models.
- **Speculative Decoding**: Added support for DFlash2 draft models when running speculative decoding via MLX.
- **Vision Refinement**: Gemma 4 now retains higher detail when processing small image inputs.
- **Integrations and Fixes**: Added `ollama launch` support for OpenCode v2 and resolved an issue causing tool-only assistant turn errors when integrating with Kimi CLI.
- **Core Dependencies**: Updated both MLX and `llama.cpp` underlying libraries.

## Why it matters

Running agentic workflows locally requires lightweight models that balance long context management with tool-use precision. The 1.7B parameter `lfm3` model delivers a large 256K-token context window in a compact memory footprint, offering local developers an alternative to cloud-hosted APIs for long-context tool invocation. While managing local context efficiently remains critical—especially when compared to how cloud tools handle heavy background routines, such as how [Claude Code background agent summaries burn tokens](/posts/claude-code-background-agent-summaries-burn-up-to-20percent-of-token-budgets/)—small models designed specifically for tool calls keep hardware resource requirements minimal.

Similarly, specialized 2B decision models like `d1` streamline routing tasks, triage logic, and intent classification at the edge without requiring multi-billion parameter generalist models.

## What to do next

Developers on supported hardware can pull the base text model using `ollama run lfm3` or evaluate classification tasks with `ollama run d1:2b`. 

### Caveats and Hardware Support
In Ollama v0.40.12, support for `lfm3` and `d1:2b` is restricted to Apple hardware running macOS. Linux and Windows compatibility for these Liquid AI models is currently in development and expected in an upcoming release.

## Sources

- [Ollama v0.40.12 Release Notes](https://github.com/ollama/ollama/releases/tag/v0.40.12)
