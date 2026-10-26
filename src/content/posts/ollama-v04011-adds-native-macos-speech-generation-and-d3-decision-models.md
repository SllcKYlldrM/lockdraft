---
title: Ollama v0.40.11 Adds Native macOS Speech Generation and d3 Decision Models
published: 2026-10-26T05:27:32.718Z
draft: false
description: >-
  Ollama v0.40.11 adds local macOS speech generation via an OpenAI-compatible
  endpoint and integrates d3 decision models in 2B to 27B sizes.
tags:
  - Ollama
  - Open Source LLMs
  - AI Agents
  - ai-news
  - open-source-llms
  - model-release
category: AI News
author: LockDraft
sourceLink: 'https://github.com/ollama/ollama/releases/tag/v0.40.11'
---

## What changed

Ollama released version 0.40.11, introducing speech generation features on macOS alongside support for the `d3` decision model family.

* **Local speech generation (macOS):** Ollama can now generate speech aloud directly through the command line or via an API on macOS. Running `ollama run` with a speech model outputs audio as text or chat replies generate. For external applications, Ollama provides streaming audio through an OpenAI-compatible `/v1/audio/speech` API endpoint. The release notes demonstrate speech execution using the `phonon` model:
  ```sh
  ollama run phonon "Hello from Ollama."
  ```
* **d3 decision models:** Ollama has added `d3` models from vLLM Semantic Router to its library. These models process text, image, or structured state inputs to perform classification, answer yes/no questions, or output probability scores across choices. The model family is available in 2B, 4B, 9B, and 27B parameter variants. Users can run decision queries via the command line using the `--ask` parameter:
  ```sh
  ollama run d3 "A customer says their card was charged twice." --ask "Is this a billing issue?"
  ```
* **Community contributions:** Pull request #19173 was merged, marking the first contribution from GitHub user @SynapShift.

## Why it matters

Exposing an OpenAI-compatible `/v1/audio/speech` endpoint enables developers to plug local speech output directly into existing audio pipelines and agent frameworks without modifying API integration logic. This avoids needing separate text-to-speech services or custom wrapper routines when deploying local voice capabilities on macOS machines.

The addition of the `d3` model family gives developers dedicated, smaller models for semantic routing, intent classification, and request guardrailing. Using targeted models ranging from 2B to 27B parameters allows pipelines to categorize incoming user requests or score options without invoking larger, resource-intensive general-purpose LLMs.

### Limitations
Speech generation capabilities in this release are explicitly documented for macOS environments. Developers working across mixed operating system deployments should account for this when evaluating local audio workflows.

## What to do next

* **Update Ollama:** Download and install version 0.40.11 from the official GitHub release page or via your preferred package manager.
* **Test speech output:** Run local speech models on macOS directly using `ollama run phonon "<your text>"` or configure local application clients to point to `http://localhost:11434/v1/audio/speech`.
* **Evaluate decision models:** Pull a `d3` model variant suited to your hardware constraints (2B, 4B, 9B, or 27B) from the Ollama library and test conditional routing queries using the `--ask` flag.

For related LockDraft context, see [Ai2 Open-Sources AstaBrief 8B for Fast Scientific Report Generation](/posts/ai2-open-sources-astabrief-8b-for-fast-scientific-report-generation/).
## Sources

* [Ollama v0.40.11 Release Notes](https://github.com/ollama/ollama/releases/tag/v0.40.11)
* [Ollama Speech Documentation](https://docs.ollama.com/capabilities/speech)
* [Ollama d3 Model Library](https://ollama.com/library/d3)
